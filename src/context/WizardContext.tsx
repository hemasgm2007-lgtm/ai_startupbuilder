import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { StartupProject, WizardData } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const EMPTY_WIZARD: WizardData = {
  startupName: '',
  idea: '',
  industry: '',
  targetAudience: '',
  budget: 25000,
  country: '',
  businessModels: [],
};

interface WizardContextValue {
  data: WizardData;
  step: number;
  setStep: (n: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (updates: Partial<WizardData>) => void;
  resetWizard: () => void;
  projects: StartupProject[];
  projectsLoading: boolean;
  addProject: (project: StartupProject) => Promise<StartupProject | null>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, updates: Partial<StartupProject>) => Promise<void>;
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
}

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

/** Map a Supabase projects row into our StartupProject type. */
function mapProject(row: {
  id: string;
  name: string;
  industry: string;
  status: string;
  wizard_data: WizardData;
  created_at: string;
}): StartupProject {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    createdAt: row.created_at,
    status: row.status as StartupProject['status'],
    wizardData: row.wizard_data,
  };
}

export function WizardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Wizard form data still persists to localStorage so a user can resume
  // an in-progress wizard after a refresh — this is ephemeral form state,
  // not durable business data.
  const [data, setData] = useState<WizardData>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.WIZARD);
    return stored ? JSON.parse(stored) : EMPTY_WIZARD;
  });
  const [step, setStep] = useState(0);
  const [projects, setProjects] = useState<StartupProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WIZARD, JSON.stringify(data));
  }, [data]);

  // Load projects from Supabase when the user is authenticated.
  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setProjectsLoading(false);
      return;
    }
    setProjectsLoading(true);
    const { data: rows, error } = await supabase
      .from('projects')
      .select('id, name, industry, status, wizard_data, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load projects:', error.message);
      setProjects([]);
    } else if (rows) {
      setProjects(rows.map(mapProject));
    }
    setProjectsLoading(false);
  }, [user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const updateData = useCallback((updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => setStep((s) => s + 1), []);
  const prevStep = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const resetWizard = useCallback(() => {
    setData(EMPTY_WIZARD);
    setStep(0);
  }, []);

  const addProject = useCallback(
    async (project: StartupProject): Promise<StartupProject | null> => {
      const { data: row, error } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          industry: project.industry,
          status: project.status,
          wizard_data: project.wizardData,
        })
        .select('id, name, industry, status, wizard_data, created_at')
        .single();

      if (error) {
        console.error('Failed to create project:', error.message);
        return null;
      }
      const mapped = mapProject(row);
      setProjects((prev) => [mapped, ...prev]);
      return mapped;
    },
    [],
  );

  const deleteProject = useCallback(async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete project:', error.message);
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<StartupProject>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.industry !== undefined) dbUpdates.industry = updates.industry;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.wizardData !== undefined) dbUpdates.wizard_data = updates.wizardData;

    const { error } = await supabase.from('projects').update(dbUpdates).eq('id', id);
    if (error) {
      console.error('Failed to update project:', error.message);
      return;
    }
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const value = useMemo<WizardContextValue>(
    () => ({
      data,
      step,
      setStep,
      nextStep,
      prevStep,
      updateData,
      resetWizard,
      projects,
      projectsLoading,
      addProject,
      deleteProject,
      updateProject,
      currentProjectId,
      setCurrentProjectId,
    }),
    [data, step, projects, projectsLoading, addProject, deleteProject, updateProject, currentProjectId, nextStep, prevStep, resetWizard, updateData],
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used within WizardProvider');
  return ctx;
}

// Convenience function to build a StartupProject from wizard data.
// The id/createdAt are placeholders — the real values come from Supabase
// after the insert. Used by the wizard before persisting.
export function createProjectFromWizard(data: WizardData): StartupProject {
  return {
    id: 'temp-' + Date.now(),
    name: data.startupName || 'Untitled Startup',
    industry: data.industry || 'Technology',
    createdAt: new Date().toISOString(),
    status: 'published',
    wizardData: data,
  };
}

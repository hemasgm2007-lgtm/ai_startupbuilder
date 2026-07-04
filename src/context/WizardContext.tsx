import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { StartupProject, WizardData } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { uid } from '../utils/helpers';

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
  addProject: (project: StartupProject) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<StartupProject>) => void;
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
}

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WizardData>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.WIZARD);
    return stored ? JSON.parse(stored) : EMPTY_WIZARD;
  });
  const [step, setStep] = useState(0);
  const [projects, setProjects] = useState<StartupProject[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return stored ? JSON.parse(stored) : [];
  });
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WIZARD, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  const updateData = useCallback((updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => setStep((s) => s + 1), []);
  const prevStep = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const resetWizard = useCallback(() => {
    setData(EMPTY_WIZARD);
    setStep(0);
  }, []);

  const addProject = useCallback((project: StartupProject) => {
    setProjects((prev) => [project, ...prev]);
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<StartupProject>) => {
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
      addProject,
      deleteProject,
      updateProject,
      currentProjectId,
      setCurrentProjectId,
    }),
    [data, step, projects, addProject, deleteProject, updateProject, currentProjectId, nextStep, prevStep, resetWizard, updateData],
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used within WizardProvider');
  return ctx;
}

// Convenience hook to create a new project from wizard data.
export function createProjectFromWizard(data: WizardData): StartupProject {
  return {
    id: uid(),
    name: data.startupName || 'Untitled Startup',
    industry: data.industry || 'Technology',
    createdAt: new Date().toISOString(),
    status: 'published',
    wizardData: data,
  };
}

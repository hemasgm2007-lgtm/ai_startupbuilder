import { motion } from 'framer-motion';
import {
  Activity, ArrowRight, Bell, Calendar, Clock, FileText, FolderPlus, MoreVertical,
  Pencil, Plus, Sparkles, Trash2, TrendingUp, Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useWizard } from '../context/WizardContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { SAMPLE_ACTIVITIES, SAMPLE_NOTIFICATIONS } from '../data/mockData';
import { formatDate, timeAgo } from '../utils/helpers';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

const ACTIVITY_ICONS = {
  create: Plus,
  generate: Sparkles,
  export: FileText,
  update: Pencil,
  login: ArrowRight,
} as const;

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { projects, deleteProject, resetWizard, setCurrentProjectId } = useWizard();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Mock usage stats
  const requestsUsed = 42;
  const requestLimit = 100;
  const usagePercent = Math.round((requestsUsed / requestLimit) * 100);

  const handleCreate = () => {
    resetWizard();
    onNavigate('/wizard');
  };

  const handleOpenProject = (id: string) => {
    setCurrentProjectId(id);
    onNavigate('/results');
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProject(deleteId);
      showToast('success', 'Project deleted.');
    }
    setDeleteId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Profile + Create */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={user?.avatarUrl}
              alt={user?.name}
              className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/20"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold">{user?.name}</h1>
              <p className="text-white/80 text-sm mt-1">{user?.email}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-xs font-medium">
                  <Sparkles className="h-3 w-3" />
                  {user?.subscription} plan
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-xs font-medium">
                  <Calendar className="h-3 w-3" />
                  Joined {user ? formatDate(user.createdAt) : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between">
          <div>
            <div className="inline-flex rounded-xl bg-primary-500/10 p-3 text-primary-500 mb-4">
              <FolderPlus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
              Start a new project
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Turn your next idea into a complete business plan.
            </p>
          </div>
          <Button fullWidth className="mt-6" onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Create New Startup
          </Button>
        </div>
      </motion.div>

      {/* AI Usage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-xl bg-primary-500/10 p-2.5 text-primary-500">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-slate-400">This month</span>
          </div>
          <p className="mt-4 text-3xl font-display font-bold text-slate-900 dark:text-white">{requestsUsed}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">AI requests used</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-xl bg-success-500/10 p-2.5 text-success-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-slate-400">Remaining</span>
          </div>
          <p className="mt-4 text-3xl font-display font-bold text-slate-900 dark:text-white">{requestLimit - requestsUsed}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Requests left this month</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex rounded-xl bg-accent-500/10 p-2.5 text-accent-500">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-slate-400">{usagePercent}% used</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
            />
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {requestLimit - requestsUsed} requests remaining until renewal
          </p>
        </div>
      </motion.div>

      {/* Projects grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white">
            Your Startup Projects
          </h2>
          <Button variant="outline" size="sm" onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
            New
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
            <EmptyState
              icon={<FolderPlus className="h-8 w-8" />}
              title="No projects yet"
              description="Create your first startup project and let AI generate a complete business plan in minutes."
              action={
                <Button onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
                  Create Your First Startup
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="inline-flex rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 p-3 text-primary-500">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <ProjectMenu
                    onView={() => handleOpenProject(project.id)}
                    onEdit={() => handleOpenProject(project.id)}
                    onDelete={() => setDeleteId(project.id)}
                  />
                </div>
                <h3 className="mt-4 text-lg font-display font-semibold text-slate-900 dark:text-white">
                  {project.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{project.industry}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant={project.status === 'published' ? 'success' : 'warning'}>
                    {project.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                  <span className="text-xs text-slate-400">{formatDate(project.createdAt)}</span>
                </div>
                <Button
                  variant="ghost"
                  fullWidth
                  className="mt-4"
                  onClick={() => handleOpenProject(project.id)}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  View plan
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Activity + Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Recent activity */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {SAMPLE_ACTIVITIES.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.type];
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 p-2 text-slate-500 dark:text-slate-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{activity.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {timeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Notifications</h3>
          </div>
          <div className="space-y-3">
            {SAMPLE_NOTIFICATIONS.slice(0, 4).map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-3 rounded-xl ${
                  !n.read ? 'bg-primary-500/5' : 'bg-slate-50 dark:bg-slate-800/30'
                }`}
              >
                <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                  n.type === 'success' ? 'bg-success-500' :
                  n.type === 'warning' ? 'bg-warning-500' : 'bg-primary-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Delete confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete project?" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This will permanently delete the project and all its generated content. This action cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth onClick={handleDelete} leftIcon={<Trash2 className="h-4 w-4" />}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function ProjectMenu({
  onView, onEdit, onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
        aria-label="Project options"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-40 glass-strong rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-800 z-40 p-1.5">
            <button onClick={() => { onView(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowRight className="h-4 w-4" /> View
            </button>
            <button onClick={() => { onEdit(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button onClick={() => { onDelete(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error-500 hover:bg-error-500/10 transition-colors">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

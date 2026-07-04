import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell, LayoutDashboard, LogOut, Menu, Plus, Settings, Shield, User as UserIcon, X,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import { Badge } from '../common/Badge';
import { SAMPLE_NOTIFICATIONS } from '../../data/mockData';

interface DashboardLayoutProps {
  children: ReactNode;
  onNavigate: (path: string) => void;
  currentPath: string;
}

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Create Startup', icon: Plus, path: '/wizard' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export function DashboardLayout({ children, onNavigate, currentPath }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = user?.role === 'admin'
    ? [...NAV_ITEMS, { label: 'Admin Panel', icon: Shield, path: '/admin' }]
    : NAV_ITEMS;

  const handleLogout = () => {
    logout();
    showToast('info', 'You have been signed out.');
    onNavigate('/');
  };

  const unreadCount = SAMPLE_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 glass border-r border-slate-200/60 dark:border-slate-800/50 z-30">
        <div className="p-6">
          <button onClick={() => onNavigate('/')} className="focus-ring rounded-lg">
            <Logo size="md" />
          </button>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-gradient-to-r from-primary-500/10 to-secondary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3">
          <div className="rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 p-4 border border-primary-500/20">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Upgrade to Pro</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unlock all 14 modules and exports.</p>
            <button
              onClick={() => onNavigate('/settings')}
              className="mt-3 w-full text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              Manage subscription →
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar — mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed inset-y-0 left-0 w-64 glass-strong z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <Logo size="md" />
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        onNavigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 glass border-b border-slate-200/60 dark:border-slate-800/50">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden sm:block">
                <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back,</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen((o) => !o)}
                  className="relative h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 glass-strong rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-800 z-40 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800">
                          <p className="font-semibold text-slate-900 dark:text-white">Notifications</p>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {SAMPLE_NOTIFICATIONS.map((n) => (
                            <div
                              key={n.id}
                              className={`p-4 border-b border-slate-200/40 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${!n.read ? 'bg-primary-500/5' : ''}`}
                            >
                              <div className="flex items-start gap-2">
                                <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                                  n.type === 'success' ? 'bg-success-500' :
                                  n.type === 'warning' ? 'bg-warning-500' : 'bg-primary-500'
                                }`} />
                                <div>
                                  <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 h-10 rounded-xl pl-1 pr-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <img src={user?.avatarUrl} alt={user?.name} className="h-8 w-8 rounded-lg object-cover" />
                  <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">{user?.name?.split(' ')[0]}</span>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 glass-strong rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-800 z-40 overflow-hidden"
                      >
                        <div className="p-3 border-b border-slate-200/60 dark:border-slate-800">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                          <div className="mt-2">
                            <Badge variant={user?.subscription === 'pro' ? 'primary' : 'neutral'}>
                              {user?.subscription} plan
                            </Badge>
                          </div>
                        </div>
                        <div className="p-1.5">
                          <button
                            onClick={() => { onNavigate('/settings'); setProfileOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <UserIcon className="h-4 w-4" />
                            Profile & Settings
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error-500 hover:bg-error-500/10 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

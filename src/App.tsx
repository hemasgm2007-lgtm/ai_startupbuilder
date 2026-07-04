import { Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { WizardProvider } from './context/WizardContext';
import { ToastContainer } from './components/common/Toast';
import { ChatAssistant } from './components/common/ChatAssistant';
import { SkeletonCard } from './components/common/Skeleton';

// Lazy-load pages for code splitting.
const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const WizardPage = lazy(() => import('./pages/WizardPage').then((m) => ({ default: m.WizardPage })));
const ResultsPage = lazy(() => import('./pages/ResultsPage').then((m) => ({ default: m.ResultsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));

// Simple hash-based router. No external dependency — keeps the bundle lean and
// avoids react-router version churn. The navigate function updates the hash and
// the route state re-renders the matching page.
function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handler = () => {
      setRoute(window.location.hash.slice(1) || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return { route, navigate };
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

function ProtectedRoute({ children, navigate }: { children: ReactNode; navigate: (p: string) => void }) {
  const { isAuthenticated, loading } = useAuth();
  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/login');
  }, [isAuthenticated, loading, navigate]);
  if (loading) return <PageLoader />;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}

function AdminRoute({ children, navigate }: { children: ReactNode; navigate: (p: string) => void }) {
  const { user, isAuthenticated, loading } = useAuth();
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) navigate('/login');
    else if (user?.role !== 'admin') navigate('/dashboard');
  }, [isAuthenticated, user, loading, navigate]);
  if (loading) return <PageLoader />;
  if (!isAuthenticated || user?.role !== 'admin') return null;
  return <>{children}</>;
}

function Router() {
  const { route, navigate } = useHashRoute();

  const renderPage = () => {
    switch (route) {
      case '/':
        return <LandingPage onNavigate={navigate} />;
      case '/login':
        return <LoginPage onNavigate={navigate} />;
      case '/register':
        return <RegisterPage onNavigate={navigate} />;
      case '/forgot-password':
        return <ForgotPasswordPage onNavigate={navigate} />;
      case '/dashboard':
        return (
          <ProtectedRoute navigate={navigate}>
            <DashboardPage onNavigate={navigate} />
          </ProtectedRoute>
        );
      case '/wizard':
        return (
          <ProtectedRoute navigate={navigate}>
            <WizardPage onNavigate={navigate} />
          </ProtectedRoute>
        );
      case '/results':
        return (
          <ProtectedRoute navigate={navigate}>
            <ResultsPage onNavigate={navigate} />
          </ProtectedRoute>
        );
      case '/settings':
        return (
          <ProtectedRoute navigate={navigate}>
            <SettingsPage onNavigate={navigate} />
          </ProtectedRoute>
        );
      case '/admin':
        return (
          <AdminRoute navigate={navigate}>
            <AdminPage onNavigate={navigate} />
          </AdminRoute>
        );
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  // Show chat assistant only on authenticated pages.
  const showChat = ['/dashboard', '/wizard', '/results', '/settings', '/admin'].includes(route);

  return (
    <>
      <Suspense fallback={<PageLoader />}>{renderPage()}</Suspense>
      {showChat && <ChatAssistant />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <WizardProvider>
            <Router />
            <ToastContainer />
          </WizardProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

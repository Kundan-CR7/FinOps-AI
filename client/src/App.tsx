
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Invoices } from './pages/Invoices';
import { BankFeeds } from './pages/BankFeeds';
import { Reconciliation } from './pages/Reconciliation';
import { Settings } from './pages/Settings';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const WelcomeGuard = () => {
  const hasSeenWelcome = useAuthStore((state) => state.hasSeenWelcome);
  if (hasSeenWelcome) return <Navigate to="/" replace />;
  return <Welcome />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/welcome" element={<AuthGuard><WelcomeGuard /></AuthGuard>} />
          
          <Route path="/" element={<AuthGuard><AppLayout /></AuthGuard>}>
            <Route index element={<Dashboard />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="bank-feeds" element={<BankFeeds />} />
            <Route path="reconciliation" element={<Reconciliation />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#27272a',
            color: '#e4e4e7',
            border: '1px solid #3f3f46',
            borderRadius: '12px',
            fontSize: '14px',
          },
          error: {
            style: {
              background: '#27272a',
              color: '#fca5a5',
              border: '1px solid #991b1b40',
            },
          },
          success: {
            style: {
              background: '#27272a',
              color: '#6ee7b7',
              border: '1px solid #065f4640',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
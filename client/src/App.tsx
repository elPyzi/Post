import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hoc/Contexts/AuthContext';
import { useAuthCheck } from './hooks/useAuthCheck';

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

const AppContent = () => {
  const { checkAuth } = useAuthCheck();
  checkAuth();

  return (
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  );
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

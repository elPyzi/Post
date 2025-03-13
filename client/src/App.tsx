import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hoc/Contexts/AuthContext';

const router = createBrowserRouter(routes);

const queryClient = new QueryClient();

import { useAuthCheck } from './hooks/useAuthCheck';

export const App = () => {
  const { checkAuth } = useAuthCheck();
  checkAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

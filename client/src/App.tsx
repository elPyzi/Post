import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAuthCheck } from './hooks/useAuthCheck';

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

const AppContent = () => {
  Notification.requestPermission();
  useAuthCheck();

  return <RouterProvider router={router} />;
};

export const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
};

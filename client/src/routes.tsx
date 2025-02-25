import { Layout } from './components/Layout';
import { Homepage } from './pages/Homepage';
import { Account } from './pages/Account';
import { ShoppingCart } from './pages/ShoppingCart';
import { RouteObject } from 'react-router-dom';
import { NotFound } from './pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: 'account',
        element: <Account />,
      },
      {
        path: 'shopping-cart',
        element: <ShoppingCart />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

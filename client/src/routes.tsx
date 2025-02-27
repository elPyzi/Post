import { Layout } from './components/Layout';
import { Homepage } from './pages/Homepage';
import { Account } from './pages/Account';
import { ShoppingCart } from './pages/ShoppingCart';
import { RouteObject } from 'react-router-dom';
import { NotFound } from './pages/NotFound';
import { Login } from './components/auth/Login/Login';
import { Reg } from './components/auth/Reg/Reg';

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
    path: 'login',
    element: <Login />,
  },
  {
    path: 'reg',
    element: <Reg />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

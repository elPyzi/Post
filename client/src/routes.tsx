import { Layout } from './components/Layout';
import { Homepage } from './pages/Homepage';
import { Account } from './pages/Account';
import { RouteObject } from 'react-router-dom';
import { Login } from './components/auth/Login/Login';
import { Reg } from './components/auth/Reg/Reg';
import { Errorpage } from './pages/Errorpage';
import { Profile } from './components/Profile/Profile';
import { Orders } from './components/Orders/Orders';
import { UserInteraction } from './components/UserInteraction/UserInteraction';
import { Deliverypage } from './pages/Deliverypage';

import { ProtectedAuth } from './utils/ProtectedRoutes/ProtectedAuth';
import { Routes } from './components/Routes/Routes';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <Errorpage />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: 'delivery/:type',
        element: <Deliverypage />,
      },
      {
        path: 'account',
        element: (
          <ProtectedAuth>
            <Account />
          </ProtectedAuth>
        ),
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: 'orders',
            element: <Orders />,
          },
          {
            path: 'user-interaction',
            element: <UserInteraction />,
          },
          {
            path: 'routes',
            element: <Routes />,
          },
        ],
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
    path: 'error/:code',
    element: <Errorpage />,
  },
];

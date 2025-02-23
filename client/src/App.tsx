import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export const App = () => <RouterProvider router={router}></RouterProvider>;

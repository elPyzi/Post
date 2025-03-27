import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch';
import { useQuery, useMutation } from '@tanstack/react-query';

import { API_CONFIG } from '../../config/api.config';

import { useAppSelector } from '../../hooks/reduxHooks';

/**
 * * Это общий компонент для Админа и курьера,
 * * Логика такая, с бека приходят данные маршрута, для админа так же приходят все пути которые доступны
 * * Для курьера приходят только его маршруты, какой курьер ты берешь с JWT
 */

type TRoutes = {
  id: number;
  name: string;
  transportType: string;
  route: Array<string>;
  carrier: {
    name: string;
    surname: string;
  };
};

export const Routes = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { authenticationFetch } = useAuthenticatedFetch();

  const getRoutes = async () => {
    return authenticationFetch<TRoutes[]>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARRIER.GET_ROUTES}`,
    );
  };

  const { data: routes } = useQuery<TRoutes[]>({
    queryKey: ['routes'],
    queryFn: getRoutes,
  });

  const deleteRoute = async (qIdRoute: number) => {
    authenticationFetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARRIER.DELETE_ROUTE}/${qIdRoute}`,
      {
        method: 'PUT',
      },
    );
  };

  const { mutate: mutateRoute } = useMutation({ mutationFn: deleteRoute });

  return (
    <table>
      <thead>
        <tr>
          <td>Маршрут №</td>
          <td>Название маршрута</td>
          <td>Путь</td>
          {user?.role === 'ADMIN' && (
            <>
              <td>Тип транспорта</td>
              <td>Курьер</td>
            </>
          )}
          <td></td>
        </tr>
      </thead>
      <tbody>
        {routes?.map((routeInfo) => (
          <tr>
            <td>{routeInfo.id}</td>
            <td>{routeInfo.name}</td>
            <td>{routeInfo.route}</td>
            {user?.role === 'ADMIN' && (
              <>
                <td>{routeInfo.transportType}</td>
                <td>
                  {routeInfo.carrier.name} {routeInfo.carrier.surname}
                </td>
              </>
            )}
            <td>
              <button type="button" onClick={() => mutateRoute(routeInfo.id)}>
                Удалить заказ
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

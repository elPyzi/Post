import Cookies from 'js-cookie';

import { useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthCheck } from '../../../hooks/useAuthCheck';
import { useNavigate } from 'react-router-dom';

import { API_CONFIG } from '../../../config/api.config';
import { PushMessages } from '../../../utils/PushMesseges';

type TOrder = {
  id: number;
  name: string;
  locationInfo: {
    from: string;
    goingTo: string;
  };
};

export const OrdersClient = () => {
  const pushMessages = useMemo(() => new PushMessages(), []);
  const navigate = useNavigate();
  const { checkAuth } = useAuthCheck();

  const getOrders = async (): Promise<TOrder[]> => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      await checkAuth();
      if (!Cookies.get('accessToken')) {
        navigate('/login');
        pushMessages.showErrorMessage('Сессия истекла', {
          body: 'Авторизуйтесь снова',
        });
        throw new Error('Unauthorized');
      }
      return getOrders();
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT.GET_ORDERS}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (!response.ok) throw new Error(`error with fetch`);

      return await response.json();
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  // * Получение заказов
  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery<TOrder[]>({
    queryKey: ['client-orders'],
    queryFn: getOrders,
  });

  // * Удалить заказ
  const deleteOrder = async ({ orderId }: { orderId: number }) => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      await checkAuth();
      if (!Cookies.get('accessToken')) {
        navigate('/login');
        pushMessages.showErrorMessage('Сессия истекла', {
          body: 'Авторизуйтесь снова',
        });
        throw new Error('Unauthorized');
      }
      return deleteOrder({ orderId });
    }
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT.DELETE_ORDER}/${orderId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 401) {
        await checkAuth();
        if (!Cookies.get('accessToken')) {
          navigate('/login');
          pushMessages.showErrorMessage('Сессия истекла', {
            body: 'Авторизуйтесь снова',
          });
          throw new Error('Unauthorized');
        }
        return deleteOrder({ orderId });
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  const { mutate } = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      pushMessages.showCheckMessage('Заказ удален', {});
      refetch();
    },
  });

  const handleDeleteOrder = (id: number) => {
    mutate({ orderId: id });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <table>
      <thead>
        <tr>
          <td>Имя заказа</td>
          <td>Удалить заказ</td>
        </tr>
      </thead>
      <tbody>
        {orders?.map((order) => (
          <tr key={order.id}>
            <td>{order.name}</td>
            <td>
              <button type="button" onClick={() => handleDeleteOrder(order.id)}>
                Удалить заказа
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

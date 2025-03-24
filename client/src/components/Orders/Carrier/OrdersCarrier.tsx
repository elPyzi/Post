import Cookies from 'js-cookie';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { API_CONFIG } from '../../../config/api.config';
import { useAuthCheck } from '../../../hooks/useAuthCheck';

type TOrder = {
  id: number;
  name: string;
  locationInfo: {
    from: string;
    goingTo: string;
  };
};

export const OrdersCarrier = () => {
  const { checkAuth } = useAuthCheck();
  const navigate = useNavigate();
  const [route, setRoute] = useState<string[]>([]);

  const {
    data: orders,
    error,
    isError,
    refetch,
  } = useQuery<TOrder[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch('http://localhost:4242/api/carrier/orders', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
          Accept: 'application/json',
        },
      });
      return await response.json();
    },
  });

  const deleteOrder = async (id: number) => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      await checkAuth();
      if (!Cookies.get('accessToken')) {
        navigate('/login');
        throw new Error('unAuth');
      }
      return deleteOrder(id);
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT.DELETE_ORDER}/${id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 401) {
        await checkAuth();
        if (!Cookies.get('accessToken')) {
          navigate('/login');
          throw new Error('unAuth');
        }
        return deleteOrder(id);
      }

      if (!response.ok) throw new Error('error fetch');
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  const { mutate: orderMutation } = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => refetch(),
  });

  const handleAddOrderToRoute = ({ city }: { city: string }) => {
    setRoute((prev) => {
      const route = [...prev, city];
      return route;
    });
  };

  const startDelivery = async () => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      await checkAuth();
      if (!Cookies.get('accessToken')) {
        navigate('/login');
        throw new Error('unAuth');
      }
      return startDelivery();
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELIVERY.START_DELIVERY}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ route }),
        },
      );

      if (response.status === 401) {
        await checkAuth();
        if (!Cookies.get('accessToken')) {
          navigate('/login');
          throw new Error('unAuth');
        }
        return startDelivery();
      }

      if (!response.ok) throw new Error('error fetch');
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  const { mutate: deliveryMutation } = useMutation({
    mutationFn: startDelivery,
  });

  if (isError) {
    navigate(`/error/${error.message}`);
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <td>Заказ</td>
            <td>От куда доставить</td>
            <td>Куда доставить</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id}>
              <td>{order.name}</td>
              <td>{order.locationInfo.from}</td>
              <td>{order.locationInfo.goingTo}</td>
              <td>
                <button
                  type="button"
                  onClick={() =>
                    handleAddOrderToRoute({ city: order.locationInfo.goingTo })
                  }
                >
                  {route.includes(order.name) ? 'Убрать' : 'Добавить'}
                </button>
                <button type="button" onClick={() => orderMutation(order.id)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={() => deliveryMutation()}>
        Начать доставку
      </button>
    </>
  );
};

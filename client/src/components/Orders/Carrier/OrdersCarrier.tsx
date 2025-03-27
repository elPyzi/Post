import styles from '../Order.module.css';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { API_CONFIG } from '../../../config/api.config';
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticatedFetch';
import { TOrder } from '../../../types/Order';

export const OrdersCarrier = () => {
  const { authenticationFetch } = useAuthenticatedFetch();
  const navigate = useNavigate();
  const [route, setRoute] = useState<string[]>([]);

  const getOrders = async () => {
    return authenticationFetch<TOrder[]>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELIVERY.GET_ORDERS}`,
    );
  };

  const {
    data: orders,
    error,
    isError,
    refetch,
  } = useQuery<TOrder[]>({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const deleteOrder = async ({ orderId }: { orderId: number }) => {
    return authenticationFetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT.DELETE_ORDER}/${orderId}`,
      {
        method: 'PUT',
      },
    );
  };

  const { mutate: orderMutation } = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => refetch(),
  });

  const handleOrderRoute = ({ city }: { city: string }) => {
    setRoute((prev) => {
      return prev.includes(city)
        ? prev.filter((c) => c !== city)
        : [...prev, city];
    });
  };

  const startDelivery = async () => {
    return authenticationFetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELIVERY.START_DELIVERY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ route }),
      },
    );
  };

  const { mutate: deliveryMutation } = useMutation({
    mutationFn: startDelivery,
    onSuccess: () => {},
  });

  if (isError) {
    navigate(`/error/${error.message}`);
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <td className={styles.tableCell}>Имя заказа</td>
            <td className={styles.tableCell}>От куда</td>
            <td className={styles.tableCell}>Куда</td>
            <td className={styles.tableCell}></td>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{order.name}</td>
              <td className={styles.tableCell}>{order.locationInfo.from}</td>
              <td className={styles.tableCell}>{order.locationInfo.goingTo}</td>
              <td className={styles.tableCell}>
                <div className={styles.actionButtons}>
                  <button
                    className={styles.button}
                    type="button"
                    onClick={() =>
                      handleOrderRoute({ city: order.locationInfo.goingTo })
                    }
                  >
                    {route.includes(order.name) ? 'Убрать' : 'Добавить'}
                  </button>
                  <button
                    className={styles.button}
                    type="button"
                    onClick={() => orderMutation({ orderId: order.id })}
                  >
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={() => deliveryMutation()}
        className={styles.startDelivery}
      >
        Начать доставку
      </button>
    </div>
  );
};

import styles from '../Order.module.css';

import { useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticatedFetch';

import { API_CONFIG } from '../../../config/api.config';
import { CheckMessage } from '../../../utils/PushMessages/Check/CheckMessages';
import { TOrder } from '../../../types/Order';

export const OrdersClient = () => {
  const { authenticationFetch } = useAuthenticatedFetch();
  const pushMessages = useMemo(() => new CheckMessage(), []);

  const getOrders = async () => {
    return authenticationFetch<TOrder[]>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELIVERY.GET_ORDERS}`,
    );
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
    return authenticationFetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELIVERY.DELETE_ORDER}/${orderId}`,
      {
        method: 'PUT',
      },
    );
  };

  const { mutate } = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      pushMessages.showNotification('Заказ удален', {});
      refetch();
    },
  });

  const handleDeleteOrder = (id: number) => {
    mutate({ orderId: id });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <td className={styles.tableCell}>Имя заказа</td>
            <td className={styles.tableCell}>От куда</td>
            <td className={styles.tableCell}>Куда</td>
            <td className={styles.tableCell}>Статус</td>
            <td className={styles.tableCell}>О заказе</td>
            <td className={styles.tableCell}></td>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{order.name}</td>
              <td className={styles.tableCell}>{order.locationInfo.from}</td>
              <td className={styles.tableCell}>{order.locationInfo.goingTo}</td>
              <td className={styles.tableCell}>{order.status.type}</td>
              <td className={styles.tableCell}>{order.status.description}</td>
              <td className={styles.tableCell}>
                <div className={styles.actionButtons}>
                  <button
                    className={styles.button}
                    type="button"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Удалить заказ
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

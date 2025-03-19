import { useAppSelector } from '../../hooks/reduxHooks';
import { OrdersCarrier } from './Carrier/OrdersCarrier';
import { OrdersClient } from './Client/OrdersClient';

export const Orders = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role === 'CLIENT') return <OrdersClient />;
  if (user?.role === 'CARRIER') return <OrdersCarrier />;
};

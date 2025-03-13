import { useAuth } from '../../hooks/useAuth';
import { OrdersCarrier } from './Carrier/OrdersCarrier';
import { OrdersClient } from './Client/OrdersClient';

export const Orders = () => {
  const { user } = useAuth();

  if (user?.role === 'CLIENT') return <OrdersClient />;
  if (user?.role === 'CARRIER') return <OrdersCarrier />;
};

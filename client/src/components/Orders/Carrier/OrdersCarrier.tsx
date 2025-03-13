import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

type;

export const OrdersCarrier = () => {
  const navigate = useNavigate();
  const {
    data: orders,
    error,
    isError,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch('http://localhost:4242/api/carrier/orders');
      return await response.json();
    },
  });

  if (isError) {
    navigate(`/error/${error.message}`);
  }

  return <div>OrdersCarrier</div>;
};

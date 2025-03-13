import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

type TOrder = {
  name: string;
  price: string;
};

export const OrdersCarrier = () => {
  const navigate = useNavigate();
  const {
    data: orders,
    error,
    isError,
  } = useQuery<TOrder>({
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

  if (isError) {
    navigate(`/error/${error.message}`);
  }

  return <div>OrdersCarrier</div>;
};

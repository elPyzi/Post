import styles from './Delivery.module.css';

import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { DeliveryCard } from '../DeliveryCard/DeliveryCard';
import { API_CONFIG } from '../../config/api.config';

import { useAuthCheck } from '../../hooks/useAuthCheck';

import Cookies from 'js-cookie';

type DeliveryData = {
  id: number;
  name: string;
  description: string;
  price: number;
  img: string;
}[];

export const Delivery = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuthCheck();

  const fetchDeliveryTypes = async (): Promise<DeliveryData> => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      await checkAuth();
      return fetchDeliveryTypes();
    }

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELIVERY.DELIVERY_TYPES}`,
      {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
    );

    if (response.status === 401) {
      await checkAuth();
      return fetchDeliveryTypes();
    }

    return response.json();
  };

  const { data, isError, isLoading } = useQuery<DeliveryData>({
    queryKey: ['delivery'],
    queryFn: fetchDeliveryTypes,
  });

  if (isLoading) return <div>Загрузка</div>;

  if (isError || !data || data.length === 0) {
    navigate(`/error/${404}`);
    return null;
  }

  return (
    <div className="container">
      <div className={styles.delivery}>
        <h3 className={styles.title}>Наши доставки</h3>
        <div className={styles.deliveryTypes}>
          {data.map((deliveryType) => (
            <Link
              to={deliveryType.name.replace(/\s+/g, '-')}
              key={deliveryType.id}
            >
              <DeliveryCard
                key={deliveryType.id}
                id={deliveryType.id}
                Img={deliveryType.img}
                deliveryName={deliveryType.name}
                price={deliveryType.price}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

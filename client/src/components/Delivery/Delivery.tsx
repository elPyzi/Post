/**
 * * Компонент для вывода типов доставки
 * * DeliveryCard это компонент который выводит информацию о типе доставке
 */

import styles from './Delivery.module.css';

import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { DeliveryCard } from '../DeliveryCard/DeliveryCard';
import { API_CONFIG } from '../../config/api.config';

import { DeliveryData } from '../../types/DeliveryData';

export const Delivery = () => {
  const navigate = useNavigate();
  const { authenticationFetch } = useAuthenticatedFetch();

  const fetchDeliveryTypes = async () => {
    return authenticationFetch<DeliveryData[]>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELIVERY.DELIVERY_TYPES}`,
    );
  };

  const {
    data: deliveryTypes,
    isError,
    isLoading,
  } = useQuery<DeliveryData[]>({
    queryKey: ['delivery'],
    queryFn: fetchDeliveryTypes,
  });

  if (isLoading) return <div>Загрузка</div>;

  if (isError || !deliveryTypes || deliveryTypes.length === 0) {
    navigate(`/error/${404}`);
    return null;
  }

  return (
    <div className="container">
      <div className={styles.delivery}>
        <h3 className={styles.title}>Наши доставки</h3>
        <div className={styles.deliveryTypes}>
          {deliveryTypes.map((deliveryType) => (
            <Link to={`delivery/${deliveryType}`} key={deliveryType.id}>
              <DeliveryCard
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

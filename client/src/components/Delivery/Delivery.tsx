import { useQuery } from '@tanstack/react-query';
import styles from './Delivery.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { DeliveryCard } from '../DeliveryCard/DeliveryCard';
import { Carrier } from '../../types/User';

type DeliveryData = {
  id: number;
  name: string;
  description: string;
  price: number;
  img: string;
}[];

export const Delivery = () => {
  const navigate = useNavigate();

  const fetchDelivery = async (): Promise<DeliveryData> => {
    const response = await fetch('/api/delivery/delivery-types');
    const parseData: DeliveryData = await response.json();
    return parseData;
  };

  // const { data, isError, isLoading } = useQuery<DeliveryData>({
  //   queryKey: ['delivery'],
  //   queryFn: fetchDelivery,
  // });

  // if (isLoading) return <div>Загрузка</div>;

  // if (isError || !data || data.length === 0) {
  //   navigate('/Error', { state: { errorCode: 404 } });
  //   return null;
  // }

  return (
    <div className="container">
      <div className={styles.delivery}>
        <h3 className={styles.title}>Наши доставки</h3>
        <div className={styles.deliveryTypes}>
          {/* {data.map((deliveryType) => (
            <Link
              to={deliveryType.name.replace(/\s+/g, '-')}
              key={deliveryType.id}
            >
              <DeliveryCard
                key={deliveryType.id}
                Img={deliveryType.img}
                deliveryName={deliveryType.name}
                price={deliveryType.price}
              />
            </Link>
          ))} */}
        </div>
      </div>
    </div>
  );
};

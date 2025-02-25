import { useQuery } from 'react-query';
import styles from './Delivery.module.css';
import { Link, Navigate } from 'react-router-dom';
import { DeliveryCard } from '../DeliveryCard/DeliveryCard';

/**
 * * Егор в fetch нужно вставить url на получения типов перевозок
 * * Раскоментишь нужное, проверки позже добавлю
 */

type DeliveryData = {
  id: number;
  name: string;
  description: string;
  price: number;
  img: string;
}[];

export const Delivery = () => {
  // const fetchDelivery = async (): Promise<DeliveryData> => {
  //   const response = await fetch('');
  //   const parseData: DeliveryData = await response.json();
  //   return parseData;
  // };

  // const { data, isError, isLoading, error } = useQuery<DeliveryData>({
  //   queryKey: ['delivery'],
  //   queryFn: fetchDelivery,
  // });

  // if (isError) return <Navigate to="" />;

  return (
    <div className="container">
      <div className={styles.delivery}>
        <h3 className={styles.title}>Наши доставки</h3>
        <div className={styles.deliveryTypes}>
          <DeliveryCard Img="afdfa" deliveryName="Oleg" price="273" />
          {/* {data.map((deliveryType) => (
            <Link to={deliveryType.name.replace(/\s+/g, '-')}>
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

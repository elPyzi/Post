import styles from './DeliveryCard.module.css';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { API_CONFIG } from '../../config/api.config';
import Cookies from 'js-cookie';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { useNavigate } from 'react-router-dom';

type DeliveryCardProps = {
  id: number;
  Img: string;
  deliveryName: string;
  price: number;
};

export const DeliveryCard = ({
  id,
  Img,
  deliveryName,
  price,
}: DeliveryCardProps) => {
  const [address, setAddress] = useState<string>('Минск');
  const { checkAuth } = useAuthCheck();
  const navigate = useNavigate();

  const cities = [
    // РБ
    'Минск',
    'Брест',
    'Витебск',
    'Гомель',
    'Гродно',
    'Могилев',
    // Ру
    'Москва',
    'Санкт-Петербург',
    'Смоленск',
    // ЕС
    'Вильнюс',
    'Таллин',
    'Рига',
  ];

  const makeOrder = async ({
    id,
    goingToCity,
  }: {
    id: number;
    goingToCity: string;
  }) => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      await checkAuth();
      return makeOrder({ id, goingToCity: address });
    }
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT.MAKE_ORDER}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ id, goingToCity }),
        },
      );
      if (response.status == 401) {
        await checkAuth();
        return makeOrder;
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  const { mutate } = useMutation({
    mutationFn: makeOrder,
    onSuccess: () => {
      navigate('/');
    },
  });

  const handleDelivery = () => {
    mutate({ id, goingToCity: address });
  };

  return (
    <div className={styles.deliveryCard}>
      <img src={Img} alt="" className={styles.img} />
      <div className={styles.info}>
        <p className={styles.deliveryName}>{deliveryName}</p>
        <p className={styles.price}>{price} $</p>
        <select
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          required
          className="auth__input"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleDelivery}>
          Оформить заказ
        </button>
      </div>
    </div>
  );
};

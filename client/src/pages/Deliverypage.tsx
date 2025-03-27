import '../assets/styles/pages/Deliverypage.css';

import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../hooks/reduxHooks';

import { API_CONFIG } from '../config/api.config';
import { DeliveryData } from '../types/DeliveryData';

type TCarrier = {
  id: number;
  name: string;
}[];

export const Deliverypage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { authenticationFetch } = useAuthenticatedFetch();

  const [address, setAddress] = useState<string>('Минск');
  const [carrier, setCarrier] = useState<string>('');

  const { cities } = useAppSelector((state) => state.cities);
  const { user } = useAppSelector((state) => state.auth);

  // ! Get запросы
  const getCarriers = async () => {
    return authenticationFetch<TCarrier>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELIVERY.GET_CARRIERS}/${type}`,
    );
  };

  const getDeliveryType = async () => {
    return authenticationFetch<DeliveryData>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELIVERY.DELIVERY_TYPES}/${type}`,
    );
  };

  const { data: deliveryType } = useQuery<DeliveryData>({
    queryKey: ['deliveryType'],
    queryFn: getDeliveryType,
  });

  const { data: carriers } = useQuery<TCarrier>({
    queryKey: ['carrier'],
    queryFn: getCarriers,
  });

  // ! Мутационные запросы
  const makeOrder = async ({
    cityFrom,
    goingToCity,
    carrierId,
  }: {
    cityFrom: string | null | undefined;
    goingToCity: string;
    carrierId: number;
  }) => {
    return authenticationFetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT.MAKE_ORDER}`,
      {
        method: 'POST',
        body: { cityFrom, goingToCity, carrierId },
      },
    );
  };

  const { mutate } = useMutation({
    mutationFn: makeOrder,
    onSuccess: () => {
      navigate('/');
    },
  });

  const handleDelivery = () => {
    const selectedCarrier = carriers?.find((c) => c.name === carrier);

    if (!selectedCarrier) {
      console.error('Carrier not found');
      return;
    }

    mutate({
      cityFrom: user?.address,
      goingToCity: address,
      carrierId: selectedCarrier?.id,
    });
  };

  return (
    <div className="">
      <img src={deliveryType?.img} alt="" className="img" />
      <div className="info">
        <p className="dev name">{deliveryType?.name}</p>
        <p className="price">{deliveryType?.price} $</p>
        <select
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          required
          className="auth__input"
        >
          {cities?.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        <select
          value={carrier}
          onChange={(event) => setCarrier(event.target.value)}
          required
          className="auth__input"
        >
          {carriers?.map((carrier) => (
            <option key={carrier.id} value={carrier.name}>
              {carrier.name}
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

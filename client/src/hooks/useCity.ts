import Cookies from 'js-cookie';

import { useQuery } from '@tanstack/react-query';
import { useAuthCheck } from './useAuthCheck';

import { API_CONFIG } from '../config/api.config';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from './reduxHooks';
import { setCities } from '../store/slices/CitiesSlice';

export const useCity = () => {
  const { checkAuth } = useAuthCheck();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const getCities = async () => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      await checkAuth();
      if (!Cookies.get('accessToken')) {
        navigate('/login');
        throw new Error('unAuth');
      }
      return getCities();
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GLOBALS.GET_CITIES}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) throw new Error('fetch error');

      if (response.status === 401) {
        await checkAuth();
        if (!Cookies.get('accessToken')) {
          navigate('/');
          throw new Error('unAuth');
        }
        return getCities;
      }

      return await response.json();
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
    retry: false,
    refetchOnWindowFocus: false,
  });

  dispatch(setCities(cities));

  return { cities };
};

import { useQuery } from '@tanstack/react-query';

import { API_CONFIG } from '../config/api.config';

import { useAppDispatch } from './reduxHooks';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';
import { setCities } from '../store/slices/CitiesSlice';

type TCities = {
  id: number;
  name: string;
};

export const useCity = () => {
  const { authenticationFetch } = useAuthenticatedFetch();
  const dispatch = useAppDispatch();

  const getCities = async () => {
    return authenticationFetch<TCities[]>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GLOBALS.GET_CITIES}`,
    );
  };

  const {
    data: cities,
    isError,
    error,
  } = useQuery<TCities[]>({
    queryKey: ['cities'],
    queryFn: getCities,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    throw new Error(`Error with get cities, error: ${error}`);
  }

  if (cities && cities.length > 0) {
    dispatch(setCities(cities));
  }

  return { cities };
};

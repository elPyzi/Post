import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useAuth } from './useAuth';
import { useRefreshToken } from './useRefreshToken';
import { API_CONFIG } from '../config/api.config';

export const useAuthCheck = () => {
  const { login } = useAuth();
  const { refreshToken } = useRefreshToken();

  const checkAuth = async () => {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.CHECK}}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
          Accept: 'application/json',
        },
      },
    );
    if (response.status === 401) {
      const isRefreshed = await refreshToken();
      if (isRefreshed) {
        return checkAuth();
      }
      console.info('Токенов нету');
    }
    const data = await response.json();
    login(data.user);
  };

  useQuery({
    queryKey: ['checkAuth'],
    queryFn: checkAuth,
    retry: false,
  });

  return { checkAuth };
};

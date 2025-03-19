import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRefreshToken } from './useRefreshToken';
import { API_CONFIG } from '../config/api.config';
import { useAppDispatch } from './reduxHooks';
import { login } from '../store/slices/AuthSlice';

export const useAuthCheck = () => {
  const dispatch = useAppDispatch();
  const { refreshToken } = useRefreshToken();
  const COOKIE_ENABLE =
    localStorage.getItem('cookieEnable') === 'accept' ? true : false;

  // console.log(`COOKIE_ENABLE: ${COOKIE_ENABLE}`);

  const checkAuth = async () => {
    console.log('зашел в check auth');
    const accessToken = Cookies.get('accessToken');
    console.log(`accessToken: ${accessToken}`);

    if (accessToken) {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.CHECK}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        },
      );
      console.log(`access response:`);
      console.log(response);

      if (!response.ok || response.status === 403) return null;

      const data = await response.json();
      console.log(`Full data:`, data);
      const { user } = data;
      console.log(`user data:`, user);

      dispatch(login(user));
      return null;
    }

    console.log('Вызова рефреша');
    const isRefreshed = await refreshToken();

    console.log(`isRefreshed:${isRefreshed}`);
    if (isRefreshed) {
      console.log('рекурсивный вызов');
      return checkAuth();
    }
    console.info('Токенов нету');
    return null;
  };

  useQuery({
    queryKey: ['checkAuth'],
    queryFn: () => {
      if (COOKIE_ENABLE) return checkAuth();
      return null;
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: COOKIE_ENABLE,
  });

  return { checkAuth };
};

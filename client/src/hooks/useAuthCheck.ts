import Cookies from 'js-cookie';

import { useState, useMemo } from 'react';
import { useRefreshToken } from './useRefreshToken';
import { useAppDispatch } from './reduxHooks';

import { API_CONFIG } from '../config/api.config';
import { login } from '../store/slices/AuthSlice';

import { ErrorMessage } from '../utils/PushMessages/Error/ErrorMessages';

export const useAuthCheck = () => {
  const pushMessages = useMemo(() => new ErrorMessage(), []);
  const [isChecking, setIsChecking] = useState(true);

  const dispatch = useAppDispatch();
  const { refreshToken } = useRefreshToken();
  const COOKIE_ENABLE = localStorage.getItem('cookieEnable') === 'accept';

  const checkAuth = async () => {
    if (!COOKIE_ENABLE) return null;

    try {
      const accessToken = Cookies.get('accessToken');

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

        if (!response.ok) {
          setIsChecking(false);
          return null;
        }

        if (response.status == 403) {
          pushMessages.HTTP403();
          setIsChecking(false);
          return null;
        }

        const data = await response.json();
        const { user } = data;
        dispatch(login(user));
        setIsChecking(false);
        return null;
      }

      const isRefreshed = await refreshToken();

      if (isRefreshed) return checkAuth();

      console.info('Токенов нету');
      return null;
    } catch (error) {
      throw new Error(`${error}`);
    } finally {
      setIsChecking(false);
    }
  };

  return { checkAuth, isChecking };
};

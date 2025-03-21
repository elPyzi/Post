import Cookies from 'js-cookie';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useRefreshToken } from './useRefreshToken';
import { useAppDispatch } from './reduxHooks';

import { API_CONFIG } from '../config/api.config';
import { login } from '../store/slices/AuthSlice';
import { PushMessages } from '../utils/PushMesseges';

export const useAuthCheck = () => {
  const [isChecking, setChecking] = useState(true);
  const pushMessages = new PushMessages();

  const dispatch = useAppDispatch();
  const { refreshToken } = useRefreshToken();
  const COOKIE_ENABLE =
    localStorage.getItem('cookieEnable') === 'accept' ? true : false;

  const checkAuth = async () => {
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
          setChecking(false);
          return null;
        }

        if (response.status == 403) {
          pushMessages.showErrorMessage('Вы заблокированы', {
            body: 'Введите себя лучше',
          });
          setChecking(false);
          return null;
        }

        const data = await response.json();
        const { user } = data;
        dispatch(login(user));
        setChecking(false);
        return null;
      }

      const isRefreshed = await refreshToken();

      if (isRefreshed) return checkAuth();

      console.info('Токенов нету');
      return null;
    } catch (error) {
      throw new Error(`${error}`);
    } finally {
      setChecking(false);
    }
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

  return { checkAuth, isChecking };
};

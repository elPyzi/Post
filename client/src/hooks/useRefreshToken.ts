import Cookies from 'js-cookie';

import { useMemo } from 'react';
import { useAppDispatch } from './reduxHooks';

import { API_CONFIG } from '../config/api.config';
import { logout } from '../store/slices/AuthSlice';
import { ErrorMessage } from '../utils/PushMessages/Error/ErrorMessages';

export const useRefreshToken = () => {
  const pushMessages = useMemo(() => new ErrorMessage(), []);
  const dispatch = useAppDispatch();

  const refreshToken = async (): Promise<boolean> => {
    const refreshToken = Cookies.get('refreshToken');

    if (refreshToken) {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      if (!response.ok || response.status === 403) return false;

      console.log('refresh true');
      return true;
    }

    pushMessages.HTTP401();
    dispatch(logout());
    return false;
  };

  return { refreshToken };
};

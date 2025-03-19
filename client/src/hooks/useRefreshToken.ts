import Cookies from 'js-cookie';
import { API_CONFIG } from '../config/api.config';
import { PushMessages } from '../utils/PushMesseges';
import { useAppDispatch } from './reduxHooks';
import { logout } from '../store/slices/AuthSlice';

export const useRefreshToken = () => {
  const pushMess = new PushMessages();
  const dispatch = useAppDispatch();

  const refreshToken = async (): Promise<boolean> => {
    console.log('refresh');
    const refreshToken = Cookies.get('refreshToken');
    console.log(`refreshToken:${refreshToken}`);

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
      console.log(`refresh response:`);
      console.log(response);
      if (!response.ok || response.status === 403) return false;

      console.log('refresh true');
      return true;
    }

    pushMess.showErrorMessage('Сессия истекла', {
      body: 'авторизуйтесь снова',
    });
    dispatch(logout());
    return false;
  };

  return { refreshToken };
};

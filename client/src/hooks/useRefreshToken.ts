import Cookies from 'js-cookie';
import { API_CONFIG } from '../config/api.config';

export const useRefreshToken = () => {
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${Cookies.get('refreshToken')}`,
          },
        },
      );
      if (!response.ok) {
        return false;
      }
      return true;
    } catch {
      throw new Error(`Refresh провален: ${error}`);
    }
  };

  return { refreshToken };
};

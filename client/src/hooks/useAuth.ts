import { useContext } from 'react';
import { AuthContext } from '../hoc/Contexts/AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};

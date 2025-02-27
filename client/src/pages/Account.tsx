import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Account = () => {
  const { isAuth } = useAuth();

  // Если пользователь не залогинен мы делаем редирект до форм логина
  if (!isAuth) return <Navigate to="/login" />;

  return <div>Account</div>;
};

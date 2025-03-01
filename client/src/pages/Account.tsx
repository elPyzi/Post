import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Account = () => {
  const { isAuth } = useAuth();
  console.log(isAuth);

  // Если пользователь не залогинен мы делаем редирект до форм логина
  if (isAuth === false) return <Navigate to="/login" />;

  return <div>Account</div>;
};

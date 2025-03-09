import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import '@/assets/styles/pages/Account.css';

export const Account = () => {
  const { isAuth, logout, user } = useAuth();
  const navigate = useNavigate();
  console.log(isAuth);

  // Если пользователь не залогинен мы делаем редирект до форм логина
  if (!isAuth) return <Navigate to="/login" />;

  const handleLogout = () => {
    navigate('/');
    setTimeout(() => {
      logout();
    }, 100);
  };

  return (
    <div className="account">
      <nav className="account__nav">
        <NavLink to="" className="account__links" end>
          Профиль
        </NavLink>

        <NavLink to="orders" className="account__links">
          Заказы
        </NavLink>
        {user?.role === 'ADMIN' && (
          <NavLink to="user-interaction" className="account__links">
            Пользователи
          </NavLink>
        )}
      </nav>
      <div className="container">
        <Outlet />
      </div>
      <button type="button" onClick={handleLogout} className="logout">
        Выйти
      </button>
    </div>
  );
};

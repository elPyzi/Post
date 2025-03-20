import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { logout } from '../store/slices/AuthSlice';
import { PushMessages } from '../utils/PushMesseges';

import '@/assets/styles/pages/Account.css';

export const Account = () => {
  const pushMessages = new PushMessages();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  console.log('hui');

  const handleLogout = () => {
    pushMessages.showCheckMessage('Хорошего дня', {});
    navigate('/');
    setTimeout(() => {
      dispatch(logout());
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

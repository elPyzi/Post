import { useLocation, useNavigate } from 'react-router-dom';
import { NotFound } from '../components/Errors/404/NotFound';
import { UserExists } from '../components/Errors/409/UserExists';

export const Errorpage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorCode = location.state?.errorCode;

  if (errorCode === 404) return <NotFound />;
  if (errorCode == 409) return <UserExists />;

  return <button onClick={() => navigate(-1)}>Назад</button>;
};

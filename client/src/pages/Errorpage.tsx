import { useNavigate, useParams } from 'react-router-dom';
import { NotFound } from '../components/Errors/404/NotFound';
import { UserExists } from '../components/Errors/409/UserExists';

export const Errorpage = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const errorCode = Number(code);
  console.log(`code ${code} errorCode ${errorCode}`);

  if (!errorCode) return <NotFound />;

  return (
    <div>
      {!errorCode && <div>404</div>}
      {errorCode === 401 && <div>401</div>}
      {errorCode === 404 && <NotFound />}
      {errorCode === 409 && <UserExists />}
      <button onClick={() => navigate(-1)}>Вернуться</button>
    </div>
  );
};

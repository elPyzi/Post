import { useLocation } from 'react-router-dom';
import { NotFound } from './NotFound';

export const Errorpage = () => {
  const location = useLocation();
  const errorCode = location.state?.errorCode;
  if (errorCode === 404) return <NotFound />;
  return <div>Errorpage</div>;
};

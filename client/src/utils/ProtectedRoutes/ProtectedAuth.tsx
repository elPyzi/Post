import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';
import { useAuthCheck } from '../../hooks/useAuthCheck';

type ProtectedAuthProps = {
  children: React.ReactNode;
};

export const ProtectedAuth = ({ children }: ProtectedAuthProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const { isChecking } = useAuthCheck();

  const isAuth = !!user;

  if (isChecking) return <div>Loading</div>;

  // ! Редирект если пользователь не аутентифицирован
  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
};

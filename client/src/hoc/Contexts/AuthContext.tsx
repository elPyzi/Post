import { createContext, useState, ReactNode, useMemo } from 'react';
import { User } from '../../types/User';
import { Token } from '../../types/Token';

//* Что будет доступно в контексте Авторизации
type AuthContextType = {
  isAuth: boolean;
  user: User | null;
  remember_me?: boolean | undefined;
  login: (userData: User, userToken?: Token) => void;
  logout: () => void;
};

//* Начальное состояние нашего пользователя
const initialState = {
  isAuth: false,
  user: {
    id: null,
    name: null,
    surname: null,
    email: null,
    tel: null,
    address: null,
    role: 'GUEST',
  },
  login: () => {},
  logout: () => {},
};

//* Создание контекста для нашего приложения и инициализация начального стейта
export const AuthContext = createContext<AuthContextType>(initialState);

type AuthProviderProps = {
  children: ReactNode;
};

//* Провайдер, обернем все приложение, что бы была доступна логика
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuth = !!user;

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuth,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

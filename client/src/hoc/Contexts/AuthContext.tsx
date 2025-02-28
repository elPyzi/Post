import { createContext, useState, ReactNode } from 'react';
import { User } from '../../types/User';
import { Roles } from '../../types/enums/roles';

//* Что будет доступно в контексте Авторизации
type AuthContextType = {
  isAuth: boolean;
  token: string | null;
  user: User | null;
  remember_me?: boolean | undefined;
  login: (userData: User, userToken: string) => void;
  logout: () => void;
};

//* Начальное состояние нашего пользователя
const initialState = {
  isAuth: false,
  token: null,
  user: {
    userName: null,
    userEmail: null,
    role: Roles.GUEST,
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
  const [token, setToken] = useState<string | null>(null);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const isAuth = !!user;

  const value = { user, token, login, logout, isAuth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

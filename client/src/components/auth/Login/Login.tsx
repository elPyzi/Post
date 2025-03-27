import '../../../assets/styles/auth.css';

import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useAppDispatch } from '../../../hooks/reduxHooks';

import { User } from '../../../types/User';
import { login } from '../../../store/slices/AuthSlice'; // Add this import
import { API_CONFIG } from '../../../config/api.config';

import { CheckMessage } from '../../../utils/PushMessages/Check/CheckMessages';
import { ErrorMessage } from '../../../utils/PushMessages/Error/ErrorMessages';

/**
 * * LoginType это типы которые принимает функция(типизация функции)
 * * email и pass для большего контроля мы делаем стейт для инпутов
 * * useNavigate это хук нужен для перенаправления(он возвращает функцию), в нашем случае я использовал редирект
 *
 * ! useMutation библа React query
 * * используется для мутаций в бд - POST UPDATE DELETE и тд операций
 * * У нее много там параметров можешь зайти в доку и посмотреть но я не использовал все
 * * mutate это функция для вызова мутаций
 * * в сам хук мы передаем функции, mutateFn пишем функцию запроса, onError onSuccess для обработки
 * * успешного и не успешного запроса
 *
 * ? Promise<TResponse>
 * * Асинхронные функции возвращают промис, типизируем этот промис по type User
 */

type LoginType = {
  email: string;
  password: string;
};

type TRespone = {
  user: User;
};

export const Login = () => {
  const pushCheckMessages = useMemo(() => new CheckMessage(), []);
  const pushErrorMessages = useMemo(() => new ErrorMessage(), []);

  const [email, setEmail] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async ({ email, password }: LoginType): Promise<TRespone> => {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      );
      if (!response.ok) throw new Error(`${response.status}`);

      return await response.json();
    },
    onSuccess: (data) => {
      const { user } = data;
      dispatch(login(user));
      pushCheckMessages.AuthSuccess();
      setTimeout(() => navigate('/'), 1000);
    },
    onError: (error) => {
      if (error.message === '403') {
        pushErrorMessages.HTTP403();
        return;
      }
      navigate(`/error/${error.message}`);
    },
  });

  const handleAuthForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({ email, password: pass });
  };

  return (
    <div className="auth">
      <form onSubmit={handleAuthForm} className="auth__form">
        <h3 className="auth__title">Login</h3>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          title="Используйте только буквы"
          required
          className="auth__input"
          autoComplete="off"
        />
        <input
          type="password"
          name="pass"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Введите ваш пароль"
          pattern=".{6,}"
          title="Пароль должен содержать минимум 6 символов"
          required
          className="auth__input"
        />
        <button type="submit" className="auth__btn">
          Join
        </button>
        <Link to="/reg" className="auth__link">
          Вы еще не зарегистрированы?
        </Link>
        <Link to="/" className="auth__link">
          Назад
        </Link>
      </form>
    </div>
  );
};

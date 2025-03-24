import '../../../assets/styles/auth.css';

import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { API_CONFIG } from '../../../config/api.config';
import { PushMessages } from '../../../utils/PushMesseges';

type TReg = {
  name: string;
  surname: string;
  address: string;
  tel: string;
  email: string;
  password: string;
};

export const Reg = () => {
  const pushMessages = new PushMessages();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [address, setAddress] = useState('Минск');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const cities = [
    // РБ
    'Минск',
    'Брест',
    'Витебск',
    'Гомель',
    'Гродно',
    'Могилев',
    // Ру
    'Москва',
    'Санкт-Петербург',
    'Смоленск',
    // ЕС
    'Вильнюс',
    'Таллин',
    'Рига',
  ];

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async ({
      name,
      surname,
      address,
      tel,
      email,
      password,
    }: TReg) => {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            surname,
            address,
            tel,
            email,
            password,
          }),
        },
      );
      if (!response.ok) throw new Error(`${response.status}`);
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      if (Number(error.message) === 409) {
        pushMessages.showErrorMessage('Ошибка данных', {
          body: 'Такой пользователь уже существует',
        });
        return;
      }
      navigate(`error-${error.message}`);
    },
  });

  const handleReg = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(address, typeof address);
    mutate({ name, surname, address, tel, email, password });
  };

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleReg}>
        <h3 className="auth__title">Registration</h3>
        <input
          type="text"
          placeholder="Введите ваше имя"
          pattern="[A-Za-zА-Яа-яЁё]{1,}"
          title="Используйте только буквы"
          required
          className="auth__input"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="text"
          placeholder="Введите вашу фамилию"
          pattern="[A-Za-zА-Яа-яЁё]{1,}"
          title="Используйте только буквы"
          required
          className="auth__input"
          value={surname}
          onChange={(event) => setSurname(event.target.value)}
        />
        <select
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          required
          className="auth__input"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="введите ваш телефон, Формат: 375296333333"
          pattern="[0-9]{12}"
          title="Формат: 375296333333"
          maxLength={12}
          required
          className="auth__input"
          value={tel}
          onChange={(event) => setTel(event.target.value)}
        />
        <input
          type="email"
          placeholder="Введите ваш email"
          pattern="[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+"
          title="Введите корректный email"
          maxLength={30}
          required
          className="auth__input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Введите ваш пароль"
          pattern=".{6,}"
          maxLength={30}
          title="Пароль должен содержать минимум 6 символов"
          required
          className="auth__input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit" className="auth__btn">
          Join
        </button>
        <button onClick={() => navigate(-1)}>Назад</button>
      </form>
    </div>
  );
};

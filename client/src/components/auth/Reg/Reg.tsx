import '../../../assets/styles/auth.css';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * !Сначала нужно почитать Логин
 */

type TReg = {
  name: string;
  surname: string;
  address: string;
  tel: string;
  email: string;
  password: string;
};

export const Reg = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [address, setAddress] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      const response = await fetch('/api/auth/reg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname, address, tel, email, password }),
      });
      if (!response.ok) throw new Error(`${response.status}`);
    },
    onSuccess: () => {
      navigate('login');
    },
    onError: (error) => {
      console.log(`Error code ${error}`);
      navigate('Error', { state: { errorCode: error } });
    },
  });

  const handleReg = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        <input
          type="text"
          placeholder="Введите ваш адрес"
          pattern=".*"
          title="Любое значение"
          required
          className="auth__input"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="введите ваш телефон"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          title="Формат: 123-456-7890"
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
          required
          className="auth__input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Введите ваш пароль"
          pattern=".{6,}"
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

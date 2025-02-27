import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/auth.css';

export const Reg = () => {
  const navigate = useNavigate();
  return (
    <div className="auth">
      <form className="auth__form">
        <h3 className="auth__title">Registration</h3>
        <input
          type="text"
          placeholder="Введите ваше имя"
          pattern="[A-Za-zА-Яа-яЁё]{1,}"
          title="Используйте только буквы"
          required
          className="auth__input"
        />
        <input
          type="text"
          placeholder="Введите вашу фамилию"
          pattern="[A-Za-zА-Яа-яЁё]{1,}"
          title="Используйте только буквы"
          required
          className="auth__input"
        />
        <input
          type="text"
          placeholder="Введите ваш адрес"
          pattern=".*"
          title="Любое значение"
          required
          className="auth__input"
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
        />
        <input
          type="email"
          placeholder="Введите ваш email"
          pattern="[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+"
          title="Введите корректный email"
          required
          className="auth__input"
        />
        <input
          type="password"
          placeholder="Введите ваш пароль"
          pattern=".{6,}"
          title="Пароль должен содержать минимум 6 символов"
          required
          className="auth__input"
        />
        <button type="submit" className="auth__btn">
          Join
        </button>
        <button onClick={() => navigate(-1)}>Назад</button>
      </form>
    </div>
  );
};

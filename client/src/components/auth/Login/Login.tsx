import { Link } from 'react-router-dom';
import '../../../assets/styles/auth.css';

export const Login = () => {
  return (
    <div className="auth">
      <form className="auth__form">
        <h3 className="auth__title">Login</h3>
        <input
          type="text"
          placeholder="Введите ваше имя"
          pattern="[A-Za-zА-Яа-яЁё]{1,}"
          title="Используйте только буквы"
          required
          className="auth__input"
          autoComplete="off"
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

import styles from './Header.module.css';
import { NavLink } from 'react-router-dom';
import { Logo } from '../Logo/Logo';

export const Header = () => {
  return (
    <header className={styles.header}>
      <Logo />
      <nav className={styles.header__nav}>
        <NavLink to="/">Homepage</NavLink>
        <NavLink className={``} to="account">
          Account
        </NavLink>
        <NavLink to="shopping-cart">Shopping cart</NavLink>
      </nav>
    </header>
  );
};

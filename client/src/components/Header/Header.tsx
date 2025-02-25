import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo/Logo';

import AccountSvg from '@/assets/images/account.svg';
import SearchSvg from '../../assets/images/search.svg';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.header__items}>
          <SearchSvg />
          <Link to="/">
            <Logo />
          </Link>
          <Link to="account">
            <AccountSvg />
          </Link>
        </div>
      </div>
    </header>
  );
};

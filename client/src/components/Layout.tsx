import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { Outlet } from 'react-router-dom';
import { CookieEnable } from './CookieEnable/CookieEnable';

export const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      <CookieEnable />
    </div>
  );
};

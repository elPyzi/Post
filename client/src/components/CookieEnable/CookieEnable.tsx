import { useState } from 'react';
import styles from './CookieEnable.module.css';

export const CookieEnable = () => {
  const [showCookieEnableWindow, setCookieEnableWindow] = useState(
    () => localStorage.getItem('cookieEnable') === 'accept',
  );

  const CookieAction = (userAnswer: string) => {
    localStorage.setItem('cookieEnable', userAnswer);
    setCookieEnableWindow(true);
  };

  return (
    <>
      {!showCookieEnableWindow && (
        <div className={styles.cookieEnable}>
          <p className={styles.useCookieTitle}>
            Мы используем cookies для улучшения вашего опыта. <br />
            Хотите включить cookies?
          </p>
          <button
            type="button"
            onClick={() => CookieAction('accept')}
            className={styles.cookieBTN}
          >
            Да
          </button>
          <button
            type="button"
            onClick={() => CookieAction('declined')}
            className={styles.cookieBTN}
          >
            Нет
          </button>
        </div>
      )}
    </>
  );
};

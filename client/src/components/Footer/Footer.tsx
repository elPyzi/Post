import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <p className={styles.p}>Join our mailing list</p>
          <div className={styles.joinUs}>
            <input type="text" id="joinMailList" className={styles.input} />
            <button type="button" className={styles.signup}>
              Sign up
            </button>
          </div>
        </div>
        <div className={styles.copy}>&copy; 2021 someone</div>
      </div>
    </footer>
  );
};

import styles from './Preview.module.css';

import PreviewVideo from '@/assets/images/video/delivery-preview.mp4';
import PreviewPoster from '@/assets/images/preview-poster.jpeg';

export const Preview = () => {
  return (
    <div className="container">
      <div className={styles.preview}>
        <div className={styles.labels}>
          <h2 className={styles.title}>
            Скорость. Надёжность. Экологичность. <br /> Ваш груз — наша забота.
          </h2>
          <p className={styles.slogan}>
            Новая эра в логистике с Post. Мы предлагаем эффективные и
            экологически чистые логистические решения, гарантируя своевременную
            доставку и минимальное воздействие на окружающую среду. Надежность и
            высокие стандарты обслуживания — наша главная цель.
          </p>
        </div>
        <video
          src={PreviewVideo}
          poster={PreviewPoster}
          autoPlay
          muted
          loop
          height="700px"
          className={styles.video}
        ></video>
      </div>
    </div>
  );
};

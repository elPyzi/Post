import styles from './Different.module.css';

import { DifferentItems } from './DifferentItem/DifferentItems';
import TruckSvg from '@/assets/images/different/truck.svg';
import MarkSvg from '@/assets/images/different/mark.svg';
import CardSvg from '@/assets/images/different/card.svg';
import PlantSvg from '@/assets/images/different/plant.svg';

export const Different = () => {
  const different = [
    {
      svg: <TruckSvg />,
      title: 'Доставка на следующий день',
      label: 'Закажите до 15:00 и получите заказ на следующий день',
    },
    {
      svg: <MarkSvg />,
      title: 'Настоящие профессионалы',
      label: 'Грузы доставляют опытные логисты с вниманием к деталям',
    },
    {
      svg: <CardSvg />,
      title: 'Лучшие цены',
      label: 'Высокое качество услуг по доступным ценам',
    },
    {
      svg: <PlantSvg />,
      title: 'Эко-упаковка',
      label: 'Используем 100% переработанную упаковку для минимизации отходов',
    },
  ];

  return (
    <div className="container">
      <div className={styles.different}>
        <h3 className={styles.diff__title}>What makes our brand different</h3>
        <div className={styles.items}>
          {different.map((item, index) => (
            <DifferentItems
              key={index}
              SvgItem={item.svg}
              Title={item.title}
              Label={item.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

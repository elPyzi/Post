import styles from './DeliveryCard.module.css';

type DeliveryCardProps = {
  Img: string;
  deliveryName: string;
  price: number;
};

export const DeliveryCard = ({
  Img,
  deliveryName,
  price,
}: DeliveryCardProps) => {
  return (
    <div className={styles.deliveryCard}>
      <img src={Img} alt="" className={styles.img} />
      <div className={styles.info}>
        <p className={styles.deliveryName}>{deliveryName}</p>
        <p className={styles.price}>{price}</p>
      </div>
    </div>
  );
};

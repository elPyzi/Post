import styles from './DeliveryCard.module.css';

type DeliveryCardProps = {
  Img: string;
  deliveryName: string;
  price: string;
};

export const DeliveryCard = ({
  Img,
  deliveryName,
  price,
}: DeliveryCardProps) => {
  return (
    <div className={styles.deliveryCard}>
      <img src={Img} alt="" className={styles.img} />
      <p className={styles.deliveryName}>{deliveryName}</p>
      <p className={styles.price}>{price} $</p>
    </div>
  );
};

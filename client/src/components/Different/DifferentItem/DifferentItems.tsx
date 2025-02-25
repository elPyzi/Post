import styles from './DifferentItems.module.css';

type DifferentItemsProps = {
  SvgItem: React.ReactNode;
  Title: string;
  Label: string;
};

export const DifferentItems = ({
  SvgItem,
  Title,
  Label,
}: DifferentItemsProps) => {
  return (
    <div>
      {SvgItem}
      <h4 className={styles.item__title}>{Title}</h4>
      <p className={styles.item__label}>{Label}</p>
    </div>
  );
};

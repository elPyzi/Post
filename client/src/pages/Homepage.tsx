import { Delivery } from '../components/Delivery/Delivery';
import { Different } from '../components/Different/Different';
import { Preview } from '../components/Preview/Preview';

export const Homepage = () => {
  return (
    <div>
      <Preview />
      <Different />
      <Delivery />
    </div>
  );
};

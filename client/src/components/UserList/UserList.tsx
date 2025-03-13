import styles from './UserList.module.css';
import { TUserInteraction } from '../UserInteraction/UserInteraction';

type TUserList = {
  user: TUserInteraction;
  handleUser: (qId: number, action: string) => void;
};

export const UserList = ({ user, handleUser }: TUserList) => {
  return (
    <tr className={styles.user}>
      <td className={styles.info}>{user.name}</td>
      <td className={styles.info}>{user.surname}</td>
      <td className={styles.info}>{user.email}</td>
      <td className={styles.info}>{user.role}</td>
      <td className={styles.actions}>
        <button
          type="button"
          onClick={() => handleUser(user.id, user.isBan ? 'unban' : 'ban')}
          className={styles.actionBtn}
        >
          {user.isBan ? 'Разблокировать' : 'Заблокировать'}
        </button>
        <button
          type="button"
          onClick={() =>
            handleUser(user.id, user.isAdmin ? 'deleteAdmin' : 'setAdmin')
          }
          className={styles.actionBtn}
        >
          {user.isAdmin ? 'ЛИШИТЬ' : 'НАДЕЛИТЬ'}
        </button>
      </td>
    </tr>
  );
};

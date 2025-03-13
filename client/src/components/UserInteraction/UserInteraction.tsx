import styles from './UserInteraction.module.css';
import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/User';
import { useAuth } from '../../hooks/useAuth';
import { UserList } from '../UserList/UserList';
import { Pagination } from '../Pagination/Pagination';
import { API_CONFIG } from '../../config/api.config';

export type TUserInteraction = Pick<
  User,
  'name' | 'surname' | 'email' | 'role'
> & {
  id: number;
  isBan: boolean;
  isAdmin: boolean;
};

const ROWS_PER_PAGE = 5;

const getTotalPageCount = (usersTotal: number): number =>
  Math.ceil(usersTotal / ROWS_PER_PAGE);

export const UserInteraction = () => {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [searchUser, setSearchUser] = useState<string | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const navigate = useNavigate();

  const getUsers = async (qUser?: string) => {
    const url = qUser
      ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.GET_USERS}/${qUser}`
      : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.GET_USERS}`;
    const response = await fetch(url);
    return await response.json();
  };

  const { data: users, refetch } = useQuery<TUserInteraction[]>({
    queryKey: ['getUsers', searchUser],
    queryFn: () => getUsers(searchUser ?? undefined),
  });

  const userInteraction = useMutation({
    mutationFn: async ({
      qUser,
      action,
    }: {
      qUser: string;
      action: string;
    }) => {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.API_ADMIN}${action}/${qUser}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ qUser }),
        },
      );
      if (!response.ok) throw new Error(`${response.status}`);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      navigate(`/error/${error.message}`);
    },
  });

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qUser = e.target.value ? e.target.value : undefined;
    setSearchUser(qUser);
  };

  const handleUser = (qUser: string, action: string) => {
    userInteraction.mutate({ qUser, action });
  };

  const handleNextPage = useCallback(() => {
    const current = currentPage;
    const next = current + 1;
    const total = users ? getTotalPageCount(users.length) : current;

    setCurrentPage(next <= total ? next : current);
  }, [currentPage, users]);

  const handlePrevPage = useCallback(() => {
    const current = currentPage;
    const prev = current - 1;
    setCurrentPage(prev > 0 ? prev : current);
  }, [currentPage]);

  return (
    <div className={styles.userInteraction}>
      <div className={styles.search}>
        <input
          type="text"
          className={styles.inp}
          value={searchUser}
          onChange={handleSearchUser}
          placeholder="Поиск"
        />
        <button type="button" className={styles.btn} onClick={() => refetch()}>
          Поиск
        </button>
      </div>
      <table className={styles.usersTable}>
        <thead>
          <tr className={styles.headings}>
            <td className={styles.heading}>Имя</td>
            <td className={styles.heading}>Фамилия</td>
            <td className={styles.heading}>Почта</td>
            <td className={styles.heading}>Роль</td>
            <td className={styles.heading}>Действия</td>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => {
            if (currentUserId === user.id) return;

            return (
              <UserList key={user.id} user={user} handleUser={handleUser} />
            );
          })}
        </tbody>
      </table>
      {users && (
        <Pagination
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          disable={{
            left: currentPage === 1,
            right: currentPage === getTotalPageCount(users.length),
          }}
          nav={{
            current: currentPage,
            total: getTotalPageCount(users.length),
          }}
        />
      )}
    </div>
  );
};

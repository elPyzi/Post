import styles from './UserInteraction.module.css';
import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/User';
import { useAuth } from '../../hooks/useAuth';
import { UserList } from '../UserList/UserList';
import { Pagination } from '../Pagination/Pagination';

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

  const [searchId, setSearchId] = useState<number | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const navigate = useNavigate();

  const getUsers = async (id?: number) => {
    const url = id
      ? `http://localhost:4242/api/admin/getUsers/${id}`
      : 'http://localhost:4242/api/admin/getUsers';
    const response = await fetch(url);
    return await response.json();
  };

  const { data: users, refetch } = useQuery<TUserInteraction[]>({
    queryKey: ['getUsers', searchId],
    queryFn: () => getUsers(searchId ?? undefined),
  });

  const userInteraction = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: string }) => {
      const response = await fetch(
        `http://localhost:4242/api/admin/${action}/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        },
      );
      if (!response.ok) throw new Error(`${response.status}`);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      navigate('/error', { state: { errorCode: error } });
    },
  });

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value ? parseInt(e.target.value, 10) : undefined;
    setSearchId(id);
  };

  const handleUser = (id: number, action: string) => {
    userInteraction.mutate({ id, action });
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
          value={searchId}
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

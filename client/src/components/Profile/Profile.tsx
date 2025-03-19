/**
 * * NewData это объект который содержит новый данные мы делаем сравнение с начальными значениями которые хранятся в user
 */

import styles from './Profile.module.css';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/User';

import { useAppSelector } from '../../hooks/reduxHooks';

import { useRefreshToken } from '../../hooks/useRefreshToken';

import Cookies from 'js-cookie';
import { API_CONFIG } from '../../config/api.config';

type TSave = Omit<User, 'role' | 'id'>;

type TUpdateUserData = { updateData: TSave; ATTEMPTS?: number };

export const Profile = () => {
  const { refreshToken } = useRefreshToken();

  const { user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState<string>(() => user?.name || '');
  const [surname, setSurname] = useState<string>(() => user?.surname || '');
  const [email, setEmail] = useState<string>(() => user?.email || '');
  const [tel, setTel] = useState<string>(() => user?.tel || '');
  const [address, setAddress] = useState<string>(() => user?.address || '');

  const navigate = useNavigate();

  const updateUserData = async ({
    updateData,
    ATTEMPTS = 0,
  }: TUpdateUserData) => {
    if (ATTEMPTS && ATTEMPTS >= 1) return;

    const dataToSave: Partial<TSave> = {};
    const newData = { name, surname, address, tel, email };

    // for (const key in newData) {
    //   if (newData[key as keyof TSave] !== user?.[key as keyof TSave]) {
    //     dataToSave[key as keyof TSave] = newData[key as keyof TSave];
    //   }
    // }

    if (newData.name !== user?.name) dataToSave.name = newData.name;
    if (newData.surname !== user?.surname) dataToSave.surname = newData.surname;
    if (newData.email !== user?.email) dataToSave.email = newData.email;
    if (newData.tel !== user?.tel) dataToSave.tel = newData.tel;
    if (newData.address !== user?.address) dataToSave.address = newData.address;

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLIENT.UPDATE}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      },
    );
    if (response.status === 401) {
      const isRefreshed = await refreshToken();
      if (isRefreshed)
        return updateUserData({ updateData: newData, ATTEMPTS: ATTEMPTS + 1 });
    }
    if (!response.ok) throw new Error(`${response.status}`);
  };

  const { mutate } = useMutation({
    mutationFn: updateUserData,
    onSuccess: () => {
      alert('Данные успешно обновлены');
    },
    onError: (error) => {
      navigate('/error', { state: { errorCode: error } });
    },
  });

  const handleProfileForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({ updateData: { name, surname, address, tel, email } });
  };

  return (
    <div>
      <form
        className={styles.save}
        onSubmit={(event) => handleProfileForm(event)}
      >
        <input
          type="text"
          placeholder="Введите ваше имя"
          pattern="[A-Za-zА-Яа-яЁё]{1,}"
          title="Используйте только буквы"
          required
          className={styles.inp}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="text"
          placeholder="Введите вашу фамилию"
          pattern="[A-Za-zА-Яа-яЁё]{1,}"
          title="Используйте только буквы"
          required
          className={styles.inp}
          value={surname}
          onChange={(event) => setSurname(event.target.value)}
        />
        <input
          type="text"
          placeholder="Введите ваш адрес"
          pattern=".*"
          title="Любое значение"
          required
          className={styles.inp}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="введите ваш телефон, Формат: 375296333333"
          pattern="[0-9]{12}"
          title="Формат: 375296333333"
          maxLength={12}
          required
          className={styles.inp}
          value={tel}
          onChange={(event) => setTel(event.target.value)}
        />
        <input
          type="email"
          placeholder="Введите ваш email"
          pattern="[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+"
          title="Введите корректный email"
          maxLength={30}
          required
          className={styles.inp}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button className={styles.saveBtn} type="submit">
          Сохранить
        </button>
      </form>
    </div>
  );
};

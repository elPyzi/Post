export type User = {
  name: string | null;
  surname: string | null;
  email: string | null;
  tel: number | null;
  address: string | null;
  role: string | 'GUEST';
};

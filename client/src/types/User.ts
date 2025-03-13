export type User = {
  id: number | null;
  name: string | null;
  surname: string | null;
  email: string | null;
  tel: string | null;
  address: string | null;
  role: string | 'GUEST';
  transportType?: string;
};

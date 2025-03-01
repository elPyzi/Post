import { Roles } from './enums/roles';

export type User = {
  userName: string | null;
  userSurname: string | null;
  userEmail: string | null;
  userTel: number | null;
  userAddress: string | null;
  role: Roles;
};

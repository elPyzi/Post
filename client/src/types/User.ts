import { Roles } from './enums/roles';

export type User = {
  userName: string | null;
  userEmail: string | null;
  role: Roles;
};

type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export type AuthUserT = {
  id: string;
  role: Role;
  phoneNumber: string;
};

export type AuthContextT = {
  isAuthLoading: boolean;
  user: AuthUserT | null | undefined;
  isSuperAdmin: boolean;
};

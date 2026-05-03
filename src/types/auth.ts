export type UserRole = 'OWNER' | 'WORKER' | 'FARMER';

export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  farmName?: string | null;
  profilePicture?: string | null;
  role: UserRole;
  ownerId: string;
  workerId?: string | null;
  staffId?: string | null;
  username?: string | null;
  assignedFieldId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

export interface SignInPayload {
  identifier: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  farmName: string;
  email?: string;
  phone?: string;
  password: string;
}

export type UserRole = 'ADMIN' | 'READONLY';

export interface UserRequest {
  username: string;
  password: string;
  role: UserRole;
}

export interface UserResponse {
  id: number;
  username: string;
  role: UserRole;
  createdAt: string;
  isProtected: boolean;
}
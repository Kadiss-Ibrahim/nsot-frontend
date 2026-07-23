export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  username: string;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
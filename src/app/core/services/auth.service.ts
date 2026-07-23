import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/auth';
  private tokenKey = 'nsot_token';
  private http = inject(HttpClient);
  private refreshTokenKey = 'nsot_refresh_token';

login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
    tap(response => {
      if (response.token) {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
      }
    })
  );
}

logout(): void {
  localStorage.removeItem(this.tokenKey);
  localStorage.removeItem(this.refreshTokenKey);
}

getRefreshToken(): string | null {
  return localStorage.getItem(this.refreshTokenKey);
}

refreshAccessToken(): Observable<LoginResponse> {
  const refreshToken = this.getRefreshToken();
  return this.http.post<LoginResponse>(`${this.baseUrl}/refresh`, { refreshToken }).pipe(
    tap(response => {
      if (response.token) {
        localStorage.setItem(this.tokenKey, response.token);
      }
    })
  );
}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken();
    if (!payload) return false;

    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      this.logout();
      return false;
    }

    return true;
  }

  getRole(): string | null {
    const payload = this.decodeToken();
    return payload?.role ?? null;
  }

  getUsername(): string | null {
    const payload = this.decodeToken();
    return payload?.sub ?? null;
  }

  private decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson) as JwtPayload;
    } catch {
      return null;
    }
  }
}
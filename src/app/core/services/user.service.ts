import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRequest, UserResponse, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/users';
  private http = inject(HttpClient);

  findAll(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.baseUrl);
  }

  findById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${id}`);
  }

  create(dto: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.baseUrl, dto);
  }

  update(id: number, dto: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(username?: string, role?: UserRole): Observable<UserResponse[]> {
    let params = new HttpParams();
    if (username) params = params.set('username', username);
    if (role) params = params.set('role', role);
    return this.http.get<UserResponse[]>(`${this.baseUrl}/search`, { params });
  }
}
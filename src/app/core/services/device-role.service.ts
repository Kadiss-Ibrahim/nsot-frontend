import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceRoleRequest, DeviceRoleResponse } from '../models/device-role.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceRoleService {
  private baseUrl = 'http://localhost:8080/api/v1/device-roles';
  private http = inject(HttpClient);

  findAll(): Observable<DeviceRoleResponse[]> {
    return this.http.get<DeviceRoleResponse[]>(this.baseUrl);
  }

  findById(id: number): Observable<DeviceRoleResponse> {
    return this.http.get<DeviceRoleResponse>(`${this.baseUrl}/${id}`);
  }

  create(dto: DeviceRoleRequest): Observable<DeviceRoleResponse> {
    return this.http.post<DeviceRoleResponse>(this.baseUrl, dto);
  }

  update(id: number, dto: DeviceRoleRequest): Observable<DeviceRoleResponse> {
    return this.http.put<DeviceRoleResponse>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(nom?: string): Observable<DeviceRoleResponse[]> {
    let params = new HttpParams();
    if (nom) params = params.set('nom', nom);
    return this.http.get<DeviceRoleResponse[]>(`${this.baseUrl}/search`, { params });
  }
}
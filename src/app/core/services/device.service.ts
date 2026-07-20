import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceRequest, DeviceResponse, DeviceStatus } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private baseUrl = 'http://localhost:8080/api/v1/devices';
  private http = inject(HttpClient);

  findAll(): Observable<DeviceResponse[]> {
    return this.http.get<DeviceResponse[]>(this.baseUrl);
  }

  findById(id: number): Observable<DeviceResponse> {
    return this.http.get<DeviceResponse>(`${this.baseUrl}/${id}`);
  }

  create(dto: DeviceRequest): Observable<DeviceResponse> {
    return this.http.post<DeviceResponse>(this.baseUrl, dto);
  }

  update(id: number, dto: DeviceRequest): Observable<DeviceResponse> {
    return this.http.put<DeviceResponse>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(
  hostname?: string,
  managementIp?: string,
  serialNumber?: string,
  model?: string,
  siteId?: number,
  status?: DeviceStatus
): Observable<DeviceResponse[]> {
  let params = new HttpParams();
  if (hostname) params = params.set('hostname', hostname);
  if (managementIp) params = params.set('managementIp', managementIp);
  if (serialNumber) params = params.set('serialNumber', serialNumber);
  if (model) params = params.set('model', model);
  if (siteId) params = params.set('siteId', siteId.toString());
  if (status) params = params.set('status', status);

  return this.http.get<DeviceResponse[]>(`${this.baseUrl}/search`, { params });
}

  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/excel`, { responseType: 'blob' });
  }
}
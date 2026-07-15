import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManufacturerRequest, ManufacturerResponse } from '../models/manufacturer.model';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  private baseUrl = 'http://localhost:8080/api/v1/manufacturers';

  constructor(private http: HttpClient) {}

  findAll(): Observable<ManufacturerResponse[]> {
    return this.http.get<ManufacturerResponse[]>(this.baseUrl);
  }

  findById(id: number): Observable<ManufacturerResponse> {
    return this.http.get<ManufacturerResponse>(`${this.baseUrl}/${id}`);
  }
  

  create(dto: ManufacturerRequest): Observable<ManufacturerResponse> {
    return this.http.post<ManufacturerResponse>(this.baseUrl, dto);
  }

  update(id: number, dto: ManufacturerRequest): Observable<ManufacturerResponse> {
    return this.http.put<ManufacturerResponse>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
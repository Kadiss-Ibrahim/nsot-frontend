import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SiteRequest, SiteResponse } from '../models/site.model';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private baseUrl = 'http://localhost:8080/api/v1/sites';
  private http = inject(HttpClient);

  findAll(): Observable<SiteResponse[]> {
    return this.http.get<SiteResponse[]>(this.baseUrl);
  }

  findById(id: number): Observable<SiteResponse> {
    return this.http.get<SiteResponse>(`${this.baseUrl}/${id}`);
  }

  create(dto: SiteRequest): Observable<SiteResponse> {
    return this.http.post<SiteResponse>(this.baseUrl, dto);
  }

  update(id: number, dto: SiteRequest): Observable<SiteResponse> {
    return this.http.put<SiteResponse>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
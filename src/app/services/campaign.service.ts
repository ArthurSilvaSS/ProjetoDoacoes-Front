import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiUrl = 'https://localhost:7130/api/campaigns';

  private campaignsUpdated$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  get campaignsUpdatedObservable(): Observable<void> {
    return this.campaignsUpdated$.asObservable();
  }
  getCampaignById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getMyCampaigns(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return this.http.get<any>(`${this.apiUrl}/my-campaigns`, { headers }).pipe(
      map(response => response.$values)
    );
  }

  getPublicCampaigns(pageNumber: number, pageSize: number): Observable<any> {
    // A resposta agora é um objeto { items: [], totalCount: 0 }
    return this.http.get<any>(`${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  createCampaign(campaignData: any): Observable<any> {
    // O token JWT será adicionado automaticamente pelo AuthInterceptor
    return this.http.post<any>(this.apiUrl, campaignData);
  }

  updateCampaign(id: number, campaignData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, campaignData);
  }

  deleteCampaign(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  notifyCampaignsUpdated(): void {
    this.campaignsUpdated$.next();
  }
}
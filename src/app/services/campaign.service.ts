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

  getMyCampaigns(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    // Aplicamos a mesma lógica de transformação aqui
    return this.http.get<any>(`${this.apiUrl}/my-campaigns`, { headers }).pipe(
      map(response => response.$values)
    );
  }

  getPublicCampaigns(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.$values)
    );
  }

  createCampaign(campaignData: any): Observable<any> {
    // O token JWT será adicionado automaticamente pelo nosso AuthInterceptor
    return this.http.post<any>(this.apiUrl, campaignData);
  }
  notifyCampaignsUpdated(): void {
    this.campaignsUpdated$.next();
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

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
    // Define cabeçalhos para instruir o navegador a NÃO usar a cache
    console.log('%cDEBUG: CampaignService - Ponto 3: getMyCampaigns foi executado! A iniciar chamada HTTP...', 'color: cyan; font-weight: bold;');
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    // Adiciona os cabeçalhos à nossa requisição GET
    return this.http.get<any[]>(`${this.apiUrl}/my-campaigns`, { headers });
  }
  createCampaign(campaignData: any): Observable<any> {
    // O token JWT será adicionado automaticamente pelo nosso AuthInterceptor
    return this.http.post<any>(this.apiUrl, campaignData);
  }
  notifyCampaignsUpdated(): void {
    this.campaignsUpdated$.next();
  }
}
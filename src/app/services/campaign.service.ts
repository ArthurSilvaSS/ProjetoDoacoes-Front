import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Campaign {
  id: number;
  titulo: string;
  descricao: string;
  imagemUrl: string | null;
  valorArrecadado: number;
  metaArrecadacao: number;
  criador?: any;
  dataInicio: string;
  dataFim: string | null;
}

export interface PagedResponse {
  items: Campaign[];
  totalCount: number;
}


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

  getCampaignById(id: number): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.apiUrl}/${id}`);
  }

  getMyCampaigns(): Observable<Campaign[]> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    return this.http.get<any>(`${this.apiUrl}/my-campaigns`, { headers }).pipe(
      map(response => response.$values || response)
    );
  }

  getPublicCampaigns(pageNumber: number, pageSize: number, search: string = ''): Observable<PagedResponse> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        // O serviço agora faz o "desembrulho" dos dados
        const campaigns: Campaign[] = response.items?.$values || response.items;
        const totalCount: number = response.totalCount;
        return { items: campaigns, totalCount: totalCount };
      })
    );
  }

  createCampaign(campaignData: FormData): Observable<Campaign> {
    return this.http.post<Campaign>(this.apiUrl, campaignData);
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
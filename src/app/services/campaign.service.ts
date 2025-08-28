import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
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

  private campaignsSubject = new BehaviorSubject<Campaign[]>([]);
  private totalCampaignsSubject = new BehaviorSubject<number>(0);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  private campaignsUpdated$ = new BehaviorSubject<void>(undefined);

  public campaigns$ = this.campaignsSubject.asObservable();
  public totalCampaigns$ = this.totalCampaignsSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();

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

  getPublicCampaigns(page: number, pageSize: number, searchTerm: string): Observable<PagedResponse> {
    return this.http.get<PagedResponse>(`/api/campaigns`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString(),
        search: searchTerm
      }
    });
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
    console.log('%c[CampaignService] Enviando SINAL de atualização...', 'color: purple; font-weight: bold;');
    this.campaignsUpdated$.next();
  }

  loadPublicCampaigns(pageNumber: number, pageSize: number, search: string = '', append: boolean = false): void {
    this.isLoadingSubject.next(true);

    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        const campaigns: Campaign[] = response.items?.$values || response.items || [];
        const totalCount: number = response.totalCount || 0;
        return { items: campaigns, totalCount: totalCount };
      })
    ).subscribe({
      next: (data: PagedResponse) => {
        if (append) {
          const currentCampaigns = this.campaignsSubject.getValue();
          this.campaignsSubject.next([...currentCampaigns, ...data.items]);
        } else {
          this.campaignsSubject.next(data.items);
        }
        console.log('%c[CampaignService] Novos dados recebidos da API. Atualizando BehaviorSubject.', 'color: brown;', data.items);
        this.totalCampaignsSubject.next(data.totalCount);
        this.isLoadingSubject.next(false);
      },
      error: (err) => {
        console.error("Erro ao carregar campanhas", err);
        this.isLoadingSubject.next(false);
      }
    });
  }
}
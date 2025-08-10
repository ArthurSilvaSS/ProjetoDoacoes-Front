import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  // A rota de doação é aninhada dentro das campanhas
  private apiUrl = 'https://localhost:7130/api/campaigns';

  constructor(private http: HttpClient) { }

  makeDonation(campaignId: number, amount: number): Observable<any> {
    const donationPayload = { valor: amount };
    // O token JWT será adicionado automaticamente pelo AuthInterceptor
    return this.http.post(`${this.apiUrl}/${campaignId}/donations`, donationPayload);
  }
}
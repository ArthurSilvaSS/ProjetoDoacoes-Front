import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://localhost:7130/api/admin';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/users`).pipe(
      map(response => response.$values.filter((item: any) => item.email !== undefined))
    );
  }
  deleteUser(id: number): Observable<object> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }
  getAllCampaigns(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/campaigns`).pipe(
      map(response => response.$values.filter((item: any) => item.titulo !== undefined)
      )
    );
  }
  deleteCampaign(id: number): Observable<object> {
    return this.http.delete(`${this.apiUrl}/campaigns/${id}`);
  }
}
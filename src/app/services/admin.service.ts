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
    // O interceptor adicionará o token do admin
    return this.http.get<any>(`${this.apiUrl}/users`).pipe(
      map(response => response.$values)
    );
  }
}
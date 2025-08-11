import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// Interface para tipar a resposta do token
interface AuthResponse {
  token: string;
}
export interface UpdateProfileData {
  newEmail: string;
  currentPassword?: string; // a senha é opcional no modelo do front-end
}

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword?: string;
}

export interface DeleteAccountData {
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // A URL da nossa API
  private apiUrl = 'https://localhost:7130/api/auth';
  private accountApiUrl = 'https://localhost:7130/api/account';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  changePassword(data: ChangePasswordData): Observable<any> {
    return this.http.post(`${this.accountApiUrl}/change-password`, data);
  }

  //Método para atualizar o perfil (email)
  updateProfile(data: UpdateProfileData): Observable<any> {
    return this.http.put(`${this.accountApiUrl}/update-profile`, data);
  }

  // Método para apagar a conta
  deleteAccount(data: DeleteAccountData): Observable<any> {
    // Usamos um POST como discutido, porque DELETE não deve ter corpo
    return this.http.post(`${this.accountApiUrl}/delete-account`, data);
  }
}
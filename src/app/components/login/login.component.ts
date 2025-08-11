import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {
    email: '',
    Senha: ''
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.errorMessage = ''; // Limpa a mensagem de erro anterior
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Sucesso!
        console.log('Login bem-sucedido!', response);
        // Armazena o token para uso futuro (ex: no localStorage)
        localStorage.setItem('authToken', response.token);
        // Redireciona para o painel do usuário (que criaremos depois)
        this.router.navigate(['/dashboard']);
        alert('Login realizado com sucesso! Token no console.');
      },
      error: (err) => {
        // Erro!
        console.error('Erro no login', err);
        this.errorMessage = 'Email ou senha inválidos. Por favor, tente novamente.';
      }
    });
  }
}
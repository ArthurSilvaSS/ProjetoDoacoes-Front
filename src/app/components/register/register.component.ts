import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // Objeto para os dados do formulário
  userData = {
    nome: '',
    email: '',
    senha: ''
  };
  confirmPassword = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.errorMessage = '';

    // 1. Validação do lado do cliente: verificar se as senhas coincidem
    if (this.userData.senha !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem. Por favor, verifique.';
      return;
    }

    // 2. Chamar o serviço de registo
    this.authService.register(this.userData).subscribe({
      next: (response) => {
        alert('Cadastro realizado com sucesso! Você já pode fazer o login.');
        // 3. Redirecionar para a página de login após o sucesso
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro no cadastro', err);
        // 4. Mostrar a mensagem de erro da API (ex: "Email já cadastrado")
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Ocorreu um erro durante o cadastro. Tente novamente.';
        }
      }
    });
  }
}
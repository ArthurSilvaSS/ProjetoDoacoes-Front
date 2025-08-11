import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UpdateProfileData, ChangePasswordData, DeleteAccountData } from '../../services/auth.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent {
  // Modelos de dados para cada formulário
  updateProfileData: UpdateProfileData = { newEmail: '' };
  changePasswordData: ChangePasswordData = {};
  deleteAccountData: DeleteAccountData = {};

  confirmPassword = ''; // Para o campo de confirmação de senha

  // Mensagens de feedback para o usuário
  updateProfileMessage: string = '';
  changePasswordMessage: string = '';
  deleteAccountError: string = '';

  constructor(private authService: AuthService) { }

  onUpdateProfile(): void {
    this.updateProfileMessage = '';
    this.authService.updateProfile(this.updateProfileData).subscribe({
      next: res => this.updateProfileMessage = 'Email atualizado com sucesso!',
      error: err => this.updateProfileMessage = `Erro: ${err.error}`
    });
  }

  onChangePassword(): void {
    this.changePasswordMessage = '';
    if (this.changePasswordData.newPassword !== this.confirmPassword) {
      this.changePasswordMessage = 'Erro: As novas senhas não coincidem.';
      return;
    }
    this.authService.changePassword(this.changePasswordData).subscribe({
      next: res => this.changePasswordMessage = 'Senha alterada com sucesso!',
      error: err => this.changePasswordMessage = `Erro: ${err.error}`
    });
  }

  onDeleteAccount(): void {
    this.deleteAccountError = '';
    if (confirm('Tem a certeza ABSOLUTA que deseja apagar a sua conta? Esta ação é irreversível e todas as suas campanhas serão desativadas.')) {
      this.authService.deleteAccount(this.deleteAccountData).subscribe({
        next: res => {
          alert('Conta apagada com sucesso. Você será desconectado.');
          this.authService.logout(); // Faz o logout e redireciona para o login
        },
        error: err => this.deleteAccountError = `Erro: ${err.error}`
      });
    }
  }
}
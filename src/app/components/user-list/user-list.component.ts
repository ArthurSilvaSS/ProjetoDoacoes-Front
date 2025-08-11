import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Erro ao carregar a lista de usuários.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  onDelete(userId: number, userName: string): void {
    // Usamos o nome do usuário para uma confirmação mais clara
    const confirmation = confirm(`Tem a certeza que deseja desativar o usuário "${userName}"? Suas campanhas também serão desativadas.`);

    if (confirmation) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          // Atualização Otimista: em vez de recarregar tudo,
          // apenas atualizamos o status do usuário na nossa lista local.
          const user = this.users.find(u => u.id === userId);
          if (user) {
            user.isDeleted = true;
          }
          alert('Usuário desativado com sucesso!');
        },
        error: (err) => {
          alert('Ocorreu um erro ao desativar o usuário.');
          console.error(err);
        }
      });
    }
  }
}
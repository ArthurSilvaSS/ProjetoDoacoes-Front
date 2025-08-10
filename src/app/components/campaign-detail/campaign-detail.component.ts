import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CampaignService } from '../../services/campaign.service';
import { DonationService } from '../../services/donation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss']
})
export class CampaignDetailComponent implements OnInit {
  campaign: any = null;
  isLoading: boolean = true;
  error: string | null = null;
  donationAmount: number | null = null;

  // Injeção de dependências moderna
  private route = inject(ActivatedRoute);
  private campaignService = inject(CampaignService);
  private donationService = inject(DonationService);
  public authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Pega o ID da URL da rota
    const campaignId = Number(this.route.snapshot.paramMap.get('id'));
    if (campaignId) {
      this.loadCampaign(campaignId);
    } else {
      this.error = "ID da campanha não encontrado.";
      this.isLoading = false;
    }
  }

  loadCampaign(id: number): void {
    this.isLoading = true;
    this.campaignService.getCampaignById(id).subscribe({
      next: (data) => {
        this.campaign = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Campanha não encontrada ou erro ao carregar.";
        this.isLoading = false;
      }
    });
  }

  onDonate(): void {
    if (!this.donationAmount || this.donationAmount <= 0) {
      alert("Por favor, insira um valor de doação válido.");
      return;
    }

    this.donationService.makeDonation(this.campaign.id, this.donationAmount).subscribe({
      next: () => {
        alert('Doação realizada com sucesso! Muito obrigado!');
        this.donationAmount = null; // Limpa o campo
        // Recarrega os dados da campanha para mostrar a atualização
        this.loadCampaign(this.campaign.id);
      },
      error: (err) => {
        alert('Ocorreu um erro ao processar a sua doação.');
        console.error(err);
      }
    });
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss']
})
export class CampaignFormComponent {
  campaign: any = {
    titulo: '',
    descricao: '',
    metaArrecadacao: null,
    dataInicio: '',
    dataFim: null
  };

  errorMessage: string = '';

  constructor(
    private campaignService: CampaignService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.errorMessage = '';

    const payload = {
      ...this.campaign,
      dataInicio: new Date(this.campaign.dataInicio).toISOString(),
      dataFim: this.campaign.dataFim ? new Date(this.campaign.dataFim).toISOString() : null
    };

    this.campaignService.createCampaign(payload).subscribe({
      next: (response) => {
        alert('Campanha criada com sucesso!');
        // AVISA que a lista de campanhas mudou
        this.campaignService.notifyCampaignsUpdated();
        // Redireciona de volta para o dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erro ao criar campanha', err);
        this.errorMessage = 'Ocorreu um erro ao criar a campanha. Verifique os dados e tente novamente.';
      }
    });
  }
}
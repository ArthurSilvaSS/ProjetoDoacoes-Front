import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss']
})
export class CampaignFormComponent implements OnInit {
  campaign: any = { titulo: '', descricao: '', metaArrecadacao: null, dataInicio: '', dataFim: null };
  errorMessage: string = '';
  isEditMode: boolean = false;
  private campaignId: number | null = null;

  constructor(
    private campaignService: CampaignService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Verifica se existe um 'id' nos parâmetros da URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.campaignId = Number(id);
      this.campaignService.getCampaignById(this.campaignId).subscribe(data => {
        data.dataInicio = this.formatDateForInput(data.dataInicio);
        data.dataFim = this.formatDateForInput(data.dataFim);
        this.campaign = data;
      });
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    const payload = {
      ...this.campaign,
      dataInicio: new Date(this.campaign.dataInicio).toISOString(),
      dataFim: this.campaign.dataFim ? new Date(this.campaign.dataFim).toISOString() : null
    };

    if (this.isEditMode && this.campaignId) {
      // LÓGICA DE ATUALIZAÇÃO
      this.campaignService.updateCampaign(this.campaignId, payload).subscribe({
        next: () => {
          alert('Campanha atualizada com sucesso!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.campaignService.createCampaign(payload).subscribe({
        next: () => {
          alert('Campanha criada com sucesso!');
          this.campaignService.notifyCampaignsUpdated();
          this.router.navigate(['/dashboard']);
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(err: any): void {
    console.error('Erro ao salvar campanha', err);
    this.errorMessage = 'Ocorreu um erro ao salvar a campanha. Verifique os dados e tente novamente.';
  }

  // Função auxiliar para formatar a data que vem da API
  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Remove os segundos e milissegundos para compatibilidade com o input
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString().slice(0, 16);
  }
}
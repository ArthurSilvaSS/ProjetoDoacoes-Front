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
  selectedFile: File | null = null;

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
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    this.errorMessage = '';


    const formData = new FormData();
    formData.append('Titulo', this.campaign.titulo);
    formData.append('Descricao', this.campaign.descricao);
    formData.append('MetaArrecadacao', this.campaign.metaArrecadacao.toString());

    if (!this.isEditMode && this.campaign.dataInicio) {
      formData.append('DataInicio', new Date(this.campaign.dataInicio).toISOString());
    }
    if (this.campaign.dataFim) {
      formData.append('DataFim', new Date(this.campaign.dataFim).toISOString());
    }

    if (this.selectedFile) {
      formData.append('ImagemArquivo', this.selectedFile, this.selectedFile.name);
    }

    if (this.isEditMode && this.campaignId) {
      // --- LÓGICA DE ATUALIZAÇÃO (AGORA IMPLEMENTADA) ---
      this.campaignService.updateCampaign(this.campaignId, formData).subscribe({
        next: () => {
          alert('Campanha atualizada com sucesso!');
          this.campaignService.notifyCampaignsUpdated(); // Notifica o dashboard para atualizar a lista
          this.router.navigate(['/dashboard']);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.campaignService.createCampaign(formData).subscribe({
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


  private formatDateForInput(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);

    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString().slice(0, 16);
  }
}
import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../services/campaign.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators'; // << 1. IMPORTAR O OPERADOR FINALIZE

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  myCampaigns: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
    console.log('%cDEBUG: Dashboard - Ponto 1: ngOnInit foi executado! A iniciar o loadCampaigns...', 'color: limegreen; font-weight: bold;');
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    console.log('%cDEBUG: Dashboard - Ponto 2: A chamar o serviço...', 'color: orange; font-weight: bold;');
    this.isLoading = true;
    this.error = null;

    this.campaignService.getMyCampaigns()
      .pipe( // << 2. USAR O .pipe() PARA ADICIONAR O OPERADOR
        finalize(() => {
          // ESTA MENSAGEM TEM DE APARECER!
          console.log('%cDEBUG: Observable FINALIZADO (quer tenha dado sucesso ou erro).', 'color: magenta; font-weight: bold;');
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          console.log('%cDEBUG: SUCESSO! Dados recebidos:', 'color: lightblue; font-weight: bold;', data);
          this.myCampaigns = data;
        },
        error: (err) => {
          console.error('%cDEBUG: ERRO!', 'color: red; font-weight: bold;', err);
          this.error = 'Não foi possível carregar as suas campanhas.';
        }
      });
  }
}
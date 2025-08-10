import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../services/campaign.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

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

  constructor(private campaignService: CampaignService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.isLoading = true;
    this.error = null;

    this.campaignService.getMyCampaigns()
      .pipe( // << 2. USAR O .pipe() PARA ADICIONAR O OPERADOR
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.myCampaigns = data;
        },
        error: (err) => {
          this.error = 'Não foi possível carregar as suas campanhas.';
        }
      });
  }
  onEdit(campaignId: number): void {
    this.router.navigate(['/dashboard/campaigns/edit', campaignId]);
  }

  onDelete(campaignId: number): void {
    if (confirm('Tem a certeza que deseja apagar esta campanha?')) {
      this.campaignService.deleteCampaign(campaignId).subscribe({
        next: () => {
          alert('Campanha apagada com sucesso!');
          this.loadCampaigns();
        },
        error: (err) => {
          alert('Ocorreu um erro ao apagar a campanha.');
          console.error(err);
        }
      });
    }
  }
}
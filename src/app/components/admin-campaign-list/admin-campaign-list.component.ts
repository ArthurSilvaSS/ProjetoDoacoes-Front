import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-campaign-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-campaign-list.component.html',
  styleUrls: ['./admin-campaign-list.component.scss']
})
export class AdminCampaignListComponent implements OnInit {
  campaigns: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.isLoading = true;
    this.adminService.getAllCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Erro ao carregar a lista de campanhas.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onDelete(campaignId: number, campaignTitle: string): void {
    if (confirm(`Tem a certeza que deseja desativar a campanha "${campaignTitle}"?`)) {
      this.adminService.deleteCampaign(campaignId).subscribe({
        next: () => {
          const campaign = this.campaigns.find(c => c.id === campaignId);
          if (campaign) {
            campaign.isDeleted = true;
          }
          alert('Campanha desativada com sucesso!');
        },
        error: (err) => alert('Ocorreu um erro ao desativar a campanha.')
      });
    }
  }
}
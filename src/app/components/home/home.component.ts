import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CampaignService } from '../../services/campaign.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HeroComponent } from '../hero/hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatPaginatorModule,
    HeroComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  campaigns: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  totalCampaigns = 0;
  pageSize = 6;
  currentPage = 0;


  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
    this.loadCampaigns();
  }
  loadCampaigns(): void {
    this.isLoading = true;
    this.campaignService.getPublicCampaigns(this.currentPage + 1, this.pageSize).subscribe({
      next: (data) => {
        this.campaigns = data.items?.$values || data.items;
        this.totalCampaigns = data.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Não foi possível carregar as campanhas no momento. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }
  // Método chamado quando o usuário muda de página
  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCampaigns();
  }
}
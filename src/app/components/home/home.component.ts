import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  campaigns: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
    console.log('%cDEBUG: HomeComponent - ngOnInit foi executado!', 'color: blue; font-weight: bold;');
    this.isLoading = true;
    this.error = null;
    this.campaignService.getPublicCampaigns().subscribe({
      next: (data) => {
        console.log('%cDEBUG: HomeComponent - SUCESSO! Dados recebidos:', 'color: lightblue;', data);
        this.campaigns = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('%cDEBUG: HomeComponent - ERRO!', 'color: red;', err);
        this.error = 'Não foi possível carregar as campanhas no momento. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }
}
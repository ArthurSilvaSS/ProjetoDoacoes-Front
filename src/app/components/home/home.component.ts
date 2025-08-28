import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignService } from '../../services/campaign.service';
import { Subject, Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HeroComponent } from '../hero/hero.component';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CampaignCardComponent } from "../campaign-card/campaign-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule,
    MatProgressBarModule, MatPaginatorModule, HeroComponent,
    SearchFilterComponent, CampaignCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  pageSize = 10;
  currentPage = 1;

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  private currentSearchTerm = '';
  private campaignUpdateSubscription!: Subscription;
  private componentId: number; // Adicione para identificar instâncias

  constructor(public campaignService: CampaignService) {
    this.componentId = Math.random(); // Gera um ID aleatório para este componente
    console.log(`%c[HomeComponent ${this.componentId}] CONSTRUCTOR`, 'color: green; font-weight: bold;');
  }

  ngOnInit(): void {
    console.log(`%c[HomeComponent ${this.componentId}] ngOnInit EXECUTADO`, 'color: blue; font-weight: bold;');
    this.loadCampaigns();

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentSearchTerm = searchTerm;
      this.currentPage = 0;
      this.loadCampaigns();
    });
    this.campaignUpdateSubscription = this.campaignService.campaignsUpdatedObservable.subscribe(() => {
      console.log('Recebido sinal de atualização de campanhas. Recarregando...');
      this.currentPage = 0;
      this.loadCampaigns();
    });
  }

  loadCampaigns(): void {
    console.log(`%c[HomeComponent ${this.componentId}] -> Chamando loadPublicCampaigns`, 'color: orange;');
    this.campaignService.loadPublicCampaigns(this.currentPage + 1, this.pageSize, this.currentSearchTerm);
  }

  onSearchChanged(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCampaigns();
  }

  ngOnDestroy(): void {
    console.log(`%c[HomeComponent ${this.componentId}] ngOnDestroy EXECUTADO`, 'color: gray; font-weight: bold;');
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.campaignUpdateSubscription) {
      this.campaignUpdateSubscription.unsubscribe();
    }
  }
}
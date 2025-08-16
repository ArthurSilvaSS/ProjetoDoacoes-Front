import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CampaignService, PagedResponse } from '../../services/campaign.service';
import { Subject, Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HeroComponent } from '../hero/hero.component';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
    SearchFilterComponent,
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  campaigns: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  totalCampaigns = 0;
  pageSize = 6;
  currentPage = 0;

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  private currentSearchTerm = '';

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
    this.loadCampaigns();
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.currentSearchTerm = searchTerm;
      this.currentPage = 0;
      this.loadCampaigns();
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  loadCampaigns(): void {
    this.isLoading = true;
    this.error = null;
    this.campaignService.getPublicCampaigns(this.currentPage + 1, this.pageSize, this.currentSearchTerm)
      .subscribe({
        next: (data: PagedResponse) => {
          this.campaigns = data.items;
          this.totalCampaigns = data.totalCount;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Não foi possível carregar as campanhas no momento. Tente novamente mais tarde.';
          this.isLoading = false;
        }
      });
  }
  onSearchChanged(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCampaigns();
  }
}
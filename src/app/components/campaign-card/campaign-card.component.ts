import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCard, MatCardModule } from "@angular/material/card";
import { MatProgressBar } from "@angular/material/progress-bar";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.component.html',
  styleUrls: ['./campaign-card.component.scss'],
  imports: [MatCard, MatCardModule, MatProgressBar, RouterLink, CommonModule]
})
export class CampaignCardComponent {
  @Input() campaign: any;
}

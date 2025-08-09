import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { CampaignFormComponent } from './components/campaign-form/campaign-form.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    // ROTA PROTEGIDA:
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'dashboard/campaigns/new',
        component: CampaignFormComponent,
        canActivate: [authGuard]
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/dashboard' }
];
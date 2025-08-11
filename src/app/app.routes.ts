import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { CampaignFormComponent } from './components/campaign-form/campaign-form.component';
import { HomeComponent } from './components/home/home.component';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'campaigns/:id', component: CampaignDetailComponent },
    // ROTA PROTEGIDA:
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'dashboard/campaigns/edit/:id',
        component: CampaignFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'dashboard/campaigns/new',
        component: CampaignFormComponent,
        canActivate: [authGuard]
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];
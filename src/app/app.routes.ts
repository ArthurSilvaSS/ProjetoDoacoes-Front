import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    // Redireciona para a tela de login se a URL estiver vazia
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
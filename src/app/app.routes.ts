import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { ManufacturerListComponent } from './features/manufacturers/manufacturer-list/manufacturer-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent , canActivate: [guestGuard]  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'devices', pathMatch: 'full' },
      { path: 'manufacturers', component: ManufacturerListComponent },
      // les autres routes (sites, device-roles, devices, users) viendront ici
      // au fur et à mesure qu'on crée leurs composants
    ]
  }
];
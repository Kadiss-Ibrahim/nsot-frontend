import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ManufacturerListComponent } from './features/manufacturers/manufacturer-list/manufacturer-list.component';
import { SiteListComponent } from './features/sites/site-list/site-list.component';
import { DeviceRoleListComponent } from './features/device-roles/device-role-list/device-role-list.component';
import { DeviceListComponent } from './features/devices/device-list/device-list.component';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'devices', pathMatch: 'full' },
      { path: 'devices', component: DeviceListComponent },
      { path: 'sites', component: SiteListComponent },
      { path: 'manufacturers', component: ManufacturerListComponent },
      { path: 'device-roles', component: DeviceRoleListComponent },
      { path: 'users', component: UserListComponent },
    ]
  }
];
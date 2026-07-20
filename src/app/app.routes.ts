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
import { ManufacturerFormComponent } from './features/manufacturers/manufacturer-form/manufacturer-form.component';
import { DeviceFormComponent } from './features/devices/device-form/device-form.component';
import { SiteFormComponent } from './features/sites/site-form/site-form.component';
import { DeviceRoleFormComponent } from './features/device-roles/device-role-form/device-role-form.component';
import { UserFormComponent } from './features/users/user-form/user-form.component';
import { adminGuard } from './core/guards/admin.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },  
      { path: 'manufacturers', component: ManufacturerListComponent },
      { path: 'manufacturers/new', component: ManufacturerFormComponent },
      { path: 'manufacturers/:id/edit', component: ManufacturerFormComponent },
      { path: 'device-roles', component: DeviceRoleListComponent },
      { path: 'device-roles/new', component: DeviceRoleFormComponent },
      { path: 'device-roles/:id/edit', component: DeviceRoleFormComponent },
      { path: 'sites', component: SiteListComponent },
      { path: 'sites/new', component: SiteFormComponent },
      { path: 'sites/:id/edit', component: SiteFormComponent },
      { path: 'users', component: UserListComponent, canActivate: [adminGuard]  },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/:id/edit', component: UserFormComponent },
      { path: 'devices', component: DeviceListComponent },
      { path: 'devices/new', component: DeviceFormComponent },
      { path: 'devices/:id/edit', component: DeviceFormComponent },
    ]
  }
];
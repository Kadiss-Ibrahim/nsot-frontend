import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ConfirmDialogModule, ToastModule],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  confirmLogout(): void {
    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment vous déconnecter ?',
      header: 'Confirmation de déconnexion',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Se déconnecter',
      rejectLabel: 'Annuler',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.logout()
    });
  }

  getUsername(): string | null {
    return this.authService.getUsername();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getInitial(): string {
    const username = this.getUsername();
    return username ? username.charAt(0).toUpperCase() : 'U';
  }
}
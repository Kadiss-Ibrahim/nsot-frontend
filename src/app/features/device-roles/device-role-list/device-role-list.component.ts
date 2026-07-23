import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { DeviceRoleService } from '../../../core/services/device-role.service';
import { DeviceRoleResponse } from '../../../core/models/device-role.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-device-role-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, RouterLink],
  templateUrl: './device-role-list.component.html'
})
export class DeviceRoleListComponent implements OnInit, OnDestroy {
  deviceRoles: DeviceRoleResponse[] = [];
  loading = true;
  error: string | null = null;

  searchNom = '';

  private searchSubject = new Subject<void>();
  private searchSubscription?: Subscription;

  private deviceRoleService = inject(DeviceRoleService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  ngOnInit(): void {
    this.loadDeviceRoles();

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => this.onSearch());
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onFilterChange(): void {
    this.searchSubject.next();
  }

  hasActiveFilters(): boolean {
    return !!this.searchNom;
  }

  loadDeviceRoles(): void {
    this.loading = true;
    this.deviceRoleService.findAll().subscribe({
      next: (data) => {
        this.deviceRoles = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des rôles';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.loading = true;
    this.error = null;
    this.deviceRoleService.search(this.searchNom || undefined).subscribe({
      next: (data) => {
        this.deviceRoles = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors de la recherche';
        this.loading = false;
      }
    });
  }

  resetSearch(): void {
    this.searchNom = '';
    this.loadDeviceRoles();
  }

  confirmDelete(role: DeviceRoleResponse): void {
    this.confirmationService.confirm({
      message: `Voulez-vous vraiment supprimer "${role.nom}" ? Cette action est irréversible.`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.deleteDeviceRole(role)
    });
  }

  private deleteDeviceRole(role: DeviceRoleResponse): void {
    this.deviceRoleService.delete(role.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Supprimé',
          detail: `"${role.nom}" a été supprimé`
        });
        this.loadDeviceRoles();
      },
      error: (err) => {
        const detail = err?.error?.message || 'Une erreur est survenue lors de la suppression';
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail });
      }
    });
  }
}
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { DeviceRoleService } from '../../../core/services/device-role.service';
import { DeviceRoleResponse } from '../../../core/models/device-role.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-device-role-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterLink],
  templateUrl: './device-role-list.component.html'
})
export class DeviceRoleListComponent implements OnInit {
  deviceRoles: DeviceRoleResponse[] = [];
  loading = true;
  error: string | null = null;
  private deviceRoleService = inject(DeviceRoleService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  ngOnInit(): void {
    this.loadDeviceRoles();
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
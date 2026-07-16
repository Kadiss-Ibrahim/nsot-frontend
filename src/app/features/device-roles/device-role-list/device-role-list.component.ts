import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DeviceRoleService } from '../../../core/services/device-role.service';
import { DeviceRoleResponse } from '../../../core/models/device-role.model';

@Component({
  selector: 'app-device-role-list',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './device-role-list.component.html'
})
export class DeviceRoleListComponent implements OnInit {
  deviceRoles: DeviceRoleResponse[] = [];
  loading = true;
  error: string | null = null;
  private deviceRoleService = inject(DeviceRoleService);

  ngOnInit(): void {
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
}
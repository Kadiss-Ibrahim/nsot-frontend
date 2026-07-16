import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DeviceService } from '../../../core/services/device.service';
import { DeviceResponse } from '../../../core/models/device.model';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule],
  templateUrl: './device-list.component.html'
})
export class DeviceListComponent implements OnInit {
  devices: DeviceResponse[] = [];
  loading = true;
  error: string | null = null;
  private deviceService = inject(DeviceService);

  ngOnInit(): void {
    this.deviceService.findAll().subscribe({
      next: (data) => {
        this.devices = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des devices';
        this.loading = false;
      }
    });
  }

  statusSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'PRODUCTION': return 'success';
      case 'STANDBY': return 'warn';
      case 'CRITICAL': return 'danger';
      default: return 'secondary';
    }
  }
}
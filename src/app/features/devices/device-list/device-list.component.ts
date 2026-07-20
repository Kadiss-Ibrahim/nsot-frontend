import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DeviceService } from '../../../core/services/device.service';
import { DeviceResponse } from '../../../core/models/device.model';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, DialogModule, RouterLink],
  templateUrl: './device-list.component.html'
})
export class DeviceListComponent implements OnInit {
  devices: DeviceResponse[] = [];
  loading = true;
  error: string | null = null;

  detailDialogVisible = false;
  selectedDevice: DeviceResponse | null = null;

  private deviceService = inject(DeviceService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.loading = true;
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

  showDetail(device: DeviceResponse): void {
    this.selectedDevice = device;
    this.detailDialogVisible = true;
  }

  statusSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'PRODUCTION': return 'success';
      case 'STANDBY': return 'warn';
      case 'CRITICAL': return 'danger';
      default: return 'secondary';
    }
  }

  criticalitySeverity(criticality: string | undefined): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (criticality) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warn';
      case 'HIGH': return 'danger';
      default: return 'secondary';
    }
  }

  confirmDelete(device: DeviceResponse): void {
    this.confirmationService.confirm({
      message: `Voulez-vous vraiment supprimer "${device.hostname}" ? Cette action est irréversible.`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.deleteDevice(device)
    });
  }

  private deleteDevice(device: DeviceResponse): void {
    this.deviceService.delete(device.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Supprimé',
          detail: `"${device.hostname}" a été supprimé`
        });
        this.loadDevices();
      },
      error: (err) => {
        const detail = err?.error?.message || 'Une erreur est survenue lors de la suppression';
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail });
      }
    });
  }

  
}
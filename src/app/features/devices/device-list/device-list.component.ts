import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DeviceService } from '../../../core/services/device.service';
import { SiteService } from '../../../core/services/site.service';
import { DeviceResponse, DeviceStatus } from '../../../core/models/device.model';
import { SiteResponse } from '../../../core/models/site.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, TagModule, ButtonModule,
    DialogModule, InputTextModule, SelectModule, RouterLink
  ],
  templateUrl: './device-list.component.html'
})
export class DeviceListComponent implements OnInit {
  devices: DeviceResponse[] = [];
  sites: SiteResponse[] = [];
  loading = true;
  error: string | null = null;

  detailDialogVisible = false;
  selectedDevice: DeviceResponse | null = null;

  // Filtres de recherche
  searchHostname = '';
  searchManagementIp = '';
  searchSerialNumber = '';
  searchModel = '';
  searchSiteId: number | null = null;
  searchStatus: DeviceStatus | null = null;
  statusOptions: DeviceStatus[] = ['PRODUCTION', 'STANDBY', 'CRITICAL', 'DECOMMISSIONED'];

  private deviceService = inject(DeviceService);
  private siteService = inject(SiteService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  isAdmin(): boolean{
    return this.authService.getRole() == 'ADMIN';
  }

  ngOnInit(): void {
    this.loadDevices();
    this.loadSites();
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

  loadSites(): void {
    this.siteService.findAll().subscribe({
      next: (data) => this.sites = data
    });
  }

  onSearch(): void {
    this.loading = true;
    this.error = null;
    this.deviceService.search(
      this.searchHostname || undefined,
      this.searchManagementIp || undefined,
      this.searchSerialNumber || undefined,
      this.searchModel || undefined,
      this.searchSiteId || undefined,
      this.searchStatus || undefined
    ).subscribe({
      next: (data) => {
        this.devices = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors de la recherche';
        this.loading = false;
      }
    });
  }

  resetSearch(): void {
    this.searchHostname = '';
    this.searchManagementIp = '';
    this.searchSerialNumber = '';
    this.searchModel = '';
    this.searchSiteId = null;
    this.searchStatus = null;
    this.loadDevices();
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

  exportToExcel(): void {
    this.deviceService.exportExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devices_${new Date().toISOString().split('T')[0]}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible d\'exporter les devices' });
      }
    });
  }
}
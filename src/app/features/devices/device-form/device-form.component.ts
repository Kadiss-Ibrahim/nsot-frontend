import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DeviceService } from '../../../core/services/device.service';
import { ManufacturerService } from '../../../core/services/manufacturer.service';
import { SiteService } from '../../../core/services/site.service';
import { DeviceRoleService } from '../../../core/services/device-role.service';
import { Criticality, DeviceRequest, DeviceStatus } from '../../../core/models/device.model';
import { SiteResponse } from '../../../core/models/site.model';
import { ManufacturerResponse } from '../../../core/models/manufacturer.model';
import { DeviceRoleResponse } from '../../../core/models/device-role.model';

@Component({
  selector: 'app-device-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './device-form.component.html'
})
export class DeviceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private deviceService = inject(DeviceService);
  private manufacturerService = inject(ManufacturerService);
  private siteService = inject(SiteService);
  private deviceRoleService = inject(DeviceRoleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.group({
    hostname: ['', [Validators.required, Validators.minLength(2)]],
    siteId: [null as number | null, Validators.required],
    deviceRoleId: [null as number | null, Validators.required],
    manufacturerId: [null as number | null, Validators.required],
    model: [''],
    serialNumber: [''],
    managementIp: [''],
    status: ['PRODUCTION' as DeviceStatus, Validators.required],
    os: [''],
    currentVersion: [''],
    rack: [''],
    rackPosition: [''],
    criticality: [null as Criticality | null],
    owner: [''],
    lastReview: [null as string | null]
  });

  sites: SiteResponse[] = [];
  deviceRoles: DeviceRoleResponse[] = [];
  manufacturers: ManufacturerResponse[] = [];
  statusOptions: DeviceStatus[] = ['PRODUCTION', 'STANDBY', 'CRITICAL', 'DECOMMISSIONED'];
  criticalityOptions: Criticality[] = ['LOW', 'MEDIUM', 'HIGH'];

  isEditMode = false;
  deviceId: number | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadSelections();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.deviceId = Number(idParam);
      this.loadDevice(this.deviceId);
    }
  }

  loadSelections(): void {
    this.siteService.findAll().subscribe({
      next: (sites) => this.sites = sites,
      error: () => this.error = 'Impossible de charger la liste des sites'
    });

    this.deviceRoleService.findAll().subscribe({
      next: (roles) => this.deviceRoles = roles,
      error: () => this.error = 'Impossible de charger la liste des rôles'
    });

    this.manufacturerService.findAll().subscribe({
      next: (manufacturers) => this.manufacturers = manufacturers,
      error: () => this.error = 'Impossible de charger la liste des fabricants'
    });
  }

  loadDevice(id: number): void {
    this.loading = true;
    this.deviceService.findById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          hostname: data.hostname,
          siteId: data.site.id,
          deviceRoleId: data.deviceRole.id,
          manufacturerId: data.manufacturer.id,
          model: data.model || '',
          serialNumber: data.serialNumber || '',
          managementIp: data.managementIp || '',
          status: data.status,
          os: data.os || '',
          currentVersion: data.currentVersion || '',
          rack: data.rack || '',
          rackPosition: data.rackPosition || '',
          criticality: data.criticality || null,
          owner: data.owner || '',
          lastReview: data.lastReview || null
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger ce device';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    const value = this.form.value as {
      hostname: string;
      siteId: number;
      deviceRoleId: number;
      manufacturerId: number;
      model: string;
      serialNumber: string;
      managementIp: string;
      status: DeviceStatus;
      os: string;
      currentVersion: string;
      rack: string;
      rackPosition: string;
      criticality: Criticality | null;
      owner: string;
      lastReview: string | null;
    };

    const dto: DeviceRequest = {
      hostname: value.hostname!,
      siteId: value.siteId!,
      deviceRoleId: value.deviceRoleId!,
      manufacturerId: value.manufacturerId!,
      model: value.model || undefined,
      serialNumber: value.serialNumber || undefined,
      managementIp: value.managementIp || undefined,
      status: value.status,
      os: value.os || undefined,
      currentVersion: value.currentVersion || undefined,
      rack: value.rack || undefined,
      rackPosition: value.rackPosition || undefined,
      criticality: value.criticality || undefined,
      owner: value.owner || undefined,
      lastReview: value.lastReview || undefined
    };

    const request$ = this.isEditMode && this.deviceId
      ? this.deviceService.update(this.deviceId, dto)
      : this.deviceService.create(dto);

    request$.subscribe({
      next: () => this.router.navigate(['/devices']),
      error: (err) => {
        this.error = err?.error?.message || 'Une erreur est survenue';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/devices']);
  }
}
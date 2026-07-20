import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DeviceRoleService } from '../../../core/services/device-role.service';

@Component({
  selector: 'app-device-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './device-role-form.component.html'
})
export class DeviceRoleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private deviceRoleService = inject(DeviceRoleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]]
  });

  isEditMode = false;
  deviceRoleId: number | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.deviceRoleId = Number(idParam);
      this.loadDeviceRole(this.deviceRoleId);
    }
  }

  loadDeviceRole(id: number): void {
    this.loading = true;
    this.deviceRoleService.findById(id).subscribe({
      next: (data) => {
        this.form.patchValue({ nom: data.nom });
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger ce rôle de device';
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
    const dto = { nom: this.form.value.nom! };

    const request$ = this.isEditMode && this.deviceRoleId
      ? this.deviceRoleService.update(this.deviceRoleId, dto)
      : this.deviceRoleService.create(dto);

    request$.subscribe({
      next: () => this.router.navigate(['/device-roles']),
      error: (err) => {
        this.error = err?.error?.message || 'Une erreur est survenue';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/device-roles']);
  }
}

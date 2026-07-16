import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ManufacturerService } from '../../../core/services/manufacturer.service';

@Component({
  selector: 'app-manufacturer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './manufacturer-form.component.html'
})
export class ManufacturerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private manufacturerService = inject(ManufacturerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]]
  });

  isEditMode = false;
  manufacturerId: number | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.manufacturerId = Number(idParam);
      this.loadManufacturer(this.manufacturerId);
    }
  }

  loadManufacturer(id: number): void {
    this.loading = true;
    this.manufacturerService.findById(id).subscribe({
      next: (data) => {
        this.form.patchValue({ nom: data.nom });
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger ce manufacturer';
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

    const request$ = this.isEditMode && this.manufacturerId
      ? this.manufacturerService.update(this.manufacturerId, dto)
      : this.manufacturerService.create(dto);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/manufacturers']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Une erreur est survenue';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/manufacturers']);
  }
}
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SiteService } from '../../../core/services/site.service';

@Component({
  selector: 'app-site-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './site-form.component.html'
})
export class SiteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private siteService = inject(SiteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    ville: ['', [Validators.required, Validators.minLength(2)]],
    pays: ['', [Validators.required, Validators.minLength(2)]],
    responsable: ['']
  });

  isEditMode = false;
  siteId: number | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.siteId = Number(idParam);
      this.loadSite(this.siteId);
    }
  }

  loadSite(id: number): void {
    this.loading = true;
    this.siteService.findById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          nom: data.nom,
          ville: data.ville,
          pays: data.pays,
          responsable: data.responsable || ''
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger ce site';
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
    const dto = {
      nom: this.form.value.nom!,
      ville: this.form.value.ville!,
      pays: this.form.value.pays!,
      responsable: this.form.value.responsable || undefined
    };

    const request$ = this.isEditMode && this.siteId
      ? this.siteService.update(this.siteId, dto)
      : this.siteService.create(dto);

    request$.subscribe({
      next: () => this.router.navigate(['/sites']),
      error: (err) => {
        this.error = err?.error?.message || 'Une erreur est survenue';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/sites']);
  }
}

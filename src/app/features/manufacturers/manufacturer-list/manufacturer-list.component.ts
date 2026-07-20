import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManufacturerService } from '../../../core/services/manufacturer.service';
import { ManufacturerResponse } from '../../../core/models/manufacturer.model';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-manufacturer-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterLink],
  templateUrl: './manufacturer-list.component.html'
})
export class ManufacturerListComponent implements OnInit {
  manufacturers: ManufacturerResponse[] = [];
  loading = true;
  error: string | null = null;

  private manufacturerService = inject(ManufacturerService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }
  ngOnInit(): void {
    this.loadManufacturers();
  }

  loadManufacturers(): void {
    this.loading = true;
    this.manufacturerService.findAll().subscribe({
      next: (data) => {
        this.manufacturers = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des manufacturers';
        this.loading = false;
      }
    });
  }

  confirmDelete(manufacturer: ManufacturerResponse): void {
    this.confirmationService.confirm({
      message: `Voulez-vous vraiment supprimer "${manufacturer.nom}" ? Cette action est irréversible.`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.deleteManufacturer(manufacturer)
    });
  }

  private deleteManufacturer(manufacturer: ManufacturerResponse): void {
    this.manufacturerService.delete(manufacturer.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Supprimé',
          detail: `"${manufacturer.nom}" a été supprimé`
        });
        this.loadManufacturers();
      },
      error: (err) => {
      const detail = err?.error?.message || 'Une erreur est survenue lors de la suppression';
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail });
      }
    });
  }
}
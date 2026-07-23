import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManufacturerService } from '../../../core/services/manufacturer.service';
import { ManufacturerResponse } from '../../../core/models/manufacturer.model';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-manufacturer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, RouterLink],
  templateUrl: './manufacturer-list.component.html'
})
export class ManufacturerListComponent implements OnInit, OnDestroy {
  manufacturers: ManufacturerResponse[] = [];
  loading = true;
  error: string | null = null;
  searchNom = '';

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  private manufacturerService = inject(ManufacturerService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }
  ngOnInit(): void {
    this.loadManufacturers();

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((searchTerm) => {
      this.searchNom = searchTerm;
      this.onSearch();
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
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

  onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  onSearch(): void {
    this.loading = true;
    this.error = null;
    this.manufacturerService.search(this.searchNom || undefined).subscribe({
      next: (data) => {
        this.manufacturers = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors de la recherche';
        this.loading = false;
      }
    });
  }

  resetSearch(): void {
    this.searchNom = '';
    this.loadManufacturers();
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
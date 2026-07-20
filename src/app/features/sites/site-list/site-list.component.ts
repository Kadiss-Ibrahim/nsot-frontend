import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { SiteService } from '../../../core/services/site.service';
import { SiteResponse } from '../../../core/models/site.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-site-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterLink],
  templateUrl: './site-list.component.html'
})
export class SiteListComponent implements OnInit {
  sites: SiteResponse[] = [];
  loading = true;
  error: string | null = null;
  private siteService = inject(SiteService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  ngOnInit(): void {
    this.loadSites();
  }

  loadSites(): void {
    this.loading = true;
    this.siteService.findAll().subscribe({
      next: (data) => {
        this.sites = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des sites';
        this.loading = false;
      }
    });
  }

  confirmDelete(site: SiteResponse): void {
    this.confirmationService.confirm({
      message: `Voulez-vous vraiment supprimer "${site.nom}" ? Cette action est irréversible.`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.deleteSite(site)
    });
  }

  private deleteSite(site: SiteResponse): void {
    this.siteService.delete(site.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Supprimé',
          detail: `"${site.nom}" a été supprimé`
        });
        this.loadSites();
      },
      error: (err) => {
        const detail = err?.error?.message || 'Une erreur est survenue lors de la suppression';
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail });
      }
    });
  }
}
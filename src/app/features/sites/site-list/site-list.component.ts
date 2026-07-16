import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SiteService } from '../../../core/services/site.service';
import { SiteResponse } from '../../../core/models/site.model';

@Component({
  selector: 'app-site-list',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './site-list.component.html'
})
export class SiteListComponent implements OnInit {
  sites: SiteResponse[] = [];
  loading = true;
  error: string | null = null;
  private siteService = inject(SiteService);

  ngOnInit(): void {
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
}
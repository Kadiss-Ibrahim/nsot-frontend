import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManufacturerService } from '../../../core/services/manufacturer.service';
import { ManufacturerResponse } from '../../../core/models/manufacturer.model';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
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

  ngOnInit(): void {
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
}
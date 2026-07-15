import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManufacturerService } from '../../../core/services/manufacturer.service';
import { ManufacturerResponse } from '../../../core/models/manufacturer.model';

@Component({
  selector: 'app-manufacturer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manufacturer-list.component.html'
})
export class ManufacturerListComponent implements OnInit {
  manufacturers: ManufacturerResponse[] = [];
  loading = true;
  error: string | null = null;

  constructor(private manufacturerService: ManufacturerService) {}

  ngOnInit(): void {
    this.manufacturerService.findAll().subscribe({
      next: (data) => {
        this.manufacturers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des manufacturers';
        this.loading = false;
      }
    });
  }
}
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { UserService } from '../../../core/services/user.service';
import { UserResponse } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users: UserResponse[] = [];
  loading = true;
  error: string | null = null;
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.findAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
      }
    });
  }
}
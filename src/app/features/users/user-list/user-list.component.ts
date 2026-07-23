import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { UserResponse, UserRole } from '../../../core/models/user.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { Tag } from "primeng/tag";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, SelectModule, RouterLink, Tag],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit, OnDestroy {
  users: UserResponse[] = [];
  loading = true;
  error: string | null = null;

  searchUsername = '';
  searchRole: UserRole | null = null;
  roleOptions: UserRole[] = ['ADMIN', 'READONLY'];

  private searchSubject = new Subject<void>();
  private searchSubscription?: Subscription;

  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.loadUsers();

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => this.onSearch());
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onFilterChange(): void {
    this.searchSubject.next();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchUsername || this.searchRole);
  }

  loadUsers(): void {
    this.loading = true;
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

  onSearch(): void {
    this.loading = true;
    this.error = null;
    this.userService.search(this.searchUsername || undefined, this.searchRole || undefined).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors de la recherche';
        this.loading = false;
      }
    });
  }

  resetSearch(): void {
    this.searchUsername = '';
    this.searchRole = null;
    this.loadUsers();
  }

  confirmDelete(user: UserResponse): void {
    this.confirmationService.confirm({
      message: `Voulez-vous vraiment supprimer "${user.username}" ? Cette action est irréversible.`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.deleteUser(user)
    });
  }

  private deleteUser(user: UserResponse): void {
    this.userService.delete(user.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Supprimé',
          detail: `"${user.username}" a été supprimé`
        });
        this.loadUsers();
      },
      error: (err) => {
        const detail = err?.error?.message || 'Une erreur est survenue lors de la suppression';
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail });
      }
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { UserService } from '../../../core/services/user.service';
import { UserRequest, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: [''],
    role: ['ADMIN', [Validators.required]]
  });

  isEditMode = false;
  userId: number | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.userId = Number(idParam);
      this.form.get('password')?.setValidators([Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
      this.loadUser(this.userId);
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.findById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          username: data.username,
          role: data.role,
          password: ''
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger cet utilisateur';
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

    const formValue = this.form.value;
    const dto: Partial<UserRequest> = {
      username: formValue.username!,
      role: formValue.role as UserRole
    };

    if (!this.isEditMode || formValue.password) {
      dto.password = formValue.password!;
    }

    const request$ = this.isEditMode && this.userId
      ? this.userService.update(this.userId, dto as UserRequest)
      : this.userService.create(dto as UserRequest);

    request$.subscribe({
      next: () => this.router.navigate(['/users']),
      error: (err) => {
        this.error = err?.error?.message || 'Une erreur est survenue';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}

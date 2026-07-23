import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;
  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(): void {
    this.error = null;
    const authService = this.authService;
    const router = this.router;
    authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Identifiants incorrects';
      }
    });
  }
}
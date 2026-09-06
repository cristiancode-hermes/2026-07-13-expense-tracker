import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-primary-600 mb-2">💰 Expense Tracker</h1>
          <p class="text-gray-500 dark:text-gray-400">Create your account</p>
        </div>

        @if (error()) {
          <div class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">{{ error() }}</div>
        }

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input type="text" [(ngModel)]="name" name="name" required
                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization</label>
            <input type="text" [(ngModel)]="orgName" name="orgName" required placeholder="Your company name"
                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required
                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600">
          </div>
          <button type="submit" [disabled]="loading()"
                  class="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50">
            {{ loading() ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="text-center mt-6 text-sm text-gray-500">
          Already have an account? <a routerLink="/login" class="text-primary-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private http = inject(HttpClient);

  name = '';
  email = '';
  password = '';
  orgName = '';
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading.set(true);
    this.error.set('');
    this.http.post<any>('http://localhost:3000/api/organizations', { name: this.orgName })
      .subscribe({
        next: (org) => {
          this.auth.register(this.name, this.email, this.password, org.id).subscribe({
            next: (res) => {
              this.auth.setSession(res);
              this.router.navigate(['/dashboard']);
            },
            error: (err: { error?: { message?: string } }) => { this.error.set(err.error?.message || 'Registration failed'); this.loading.set(false); }
          });
        },
        error: (_err: any) => { this.error.set('Failed to create organization'); this.loading.set(false); }
      });
  }
}

import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex">
      <!-- Brand Panel -->
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 opacity-[0.07]" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 42px);"></div>
        <div class="text-center relative z-10 px-12 max-w-md">
          <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
            <svg viewBox="0 0 64 64" fill="none" class="w-9 h-9 text-white">
              <rect x="4" y="20" width="56" height="36" rx="6" stroke="currentColor" stroke-width="2.5" fill="none"/>
              <path d="M32 8L20 20h24L32 8z" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h1 class="font-display text-4xl font-bold text-white mb-3">Emerald Ledger</h1>
          <p class="text-emerald-200 text-base leading-relaxed">
            Smart expense tracking with beautiful insights.
          </p>
        </div>
      </div>

      <!-- Form Panel -->
      <div class="w-full lg:w-1/2 flex items-center justify-center px-6 bg-parchment-50 dark:bg-[#1c1712]">
        <div class="w-full max-w-sm anim-fade-up">
          <div class="text-center lg:hidden mb-8">
            <h1 class="font-display text-3xl text-emerald-600 mb-1">Emerald Ledger</h1>
            <p class="text-parchment-500 text-sm">Smart expense tracking</p>
          </div>

          <div class="surface-raised rounded-xl p-7">
            <h2 class="font-display text-xl text-parchment-800 dark:text-parchment-100 mb-6">Sign In</h2>

            @if (error()) {
              <div class="bg-coral-50 text-coral-700 dark:bg-coral-900/20 dark:text-coral-300 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2"
                   style="animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {{ error() }}
              </div>
            }

            <form (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-parchment-600 dark:text-parchment-300 mb-1.5">Email</label>
                <input type="email" [(ngModel)]="email" name="email" required placeholder="you@company.com" class="input">
              </div>
              <div>
                <label class="block text-sm font-medium text-parchment-600 dark:text-parchment-300 mb-1.5">Password</label>
                <input type="password" [(ngModel)]="password" name="password" required placeholder="••••••••" class="input">
              </div>
              <button type="submit" [disabled]="loading()" class="btn-primary w-full py-2.5">
                @if (loading()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Signing in...
                } @else {
                  Sign In
                }
              </button>
            </form>

            <p class="text-center mt-5 text-sm text-parchment-500">
              Don't have an account?
              <a routerLink="/register" class="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">Register</a>
            </p>

            <div class="mt-5 p-3.5 bg-parchment-50 dark:bg-parchment-900/30 rounded-lg text-xs text-parchment-500">
              <p class="font-medium text-parchment-600 dark:text-parchment-300 mb-1">Demo accounts:</p>
              <p class="font-mono">admin@acme.com / password123</p>
              <p class="font-mono">bob@globex.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.auth.setSession(res);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Login failed');
        this.loading.set(false);
      }
    });
  }
}

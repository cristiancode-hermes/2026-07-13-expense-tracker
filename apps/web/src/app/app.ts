import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    @if (auth.isAuthenticated()) {
      <div class="flex min-h-screen bg-parchment-50 dark:bg-[#1c1712]">
        <app-sidebar [collapsed]="sidebarCollapsed()" (logout)="onLogout()" />
        <div class="flex-1 lg:ml-64 anim-fade-up">
          <router-outlet />
        </div>
      </div>
    } @else {
      <router-outlet />
    }
  `
})
export class AppComponent {
  readonly sidebarCollapsed = signal(false);

  constructor(public auth: AuthService, private router: Router) {}

  onLogout() {
    this.auth.logout();
  }
}

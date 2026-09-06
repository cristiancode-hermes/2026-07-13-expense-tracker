import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="fixed left-0 top-0 h-full w-64 bg-parchment-900 dark:bg-[#1a1610] z-40 transition-transform duration-300 ease-out-expo"
           [class.-translate-x-full]="!collapsed()">
      <!-- Brand -->
      <div class="px-6 py-5 border-b border-parchment-700/50">
        <div class="flex items-center gap-2.5">
          <svg class="w-7 h-7 text-emerald-400" viewBox="0 0 64 64" fill="none">
            <rect x="4" y="20" width="56" height="36" rx="6" stroke="currentColor" stroke-width="2.5" fill="none"/>
            <path d="M32 8L20 20h24L32 8z" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2"/>
            <text x="32" y="46" text-anchor="middle" fill="currentColor" font-size="22" font-family="Fraunces, Georgia, serif">EL</text>
          </svg>
          <h1 class="font-display text-lg text-parchment-100">Emerald Ledger</h1>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-3 space-y-1">
        @for (item of menuItems; track item.path) {
          <a [routerLink]="item.path"
             routerLinkActive="bg-emerald-600 text-white shadow-sm"
             [routerLinkActiveOptions]="{exact: item.exact}"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-parchment-300 hover:bg-parchment-800/50 hover:text-parchment-100 transition-all duration-200 text-sm font-medium">
            <span class="w-5 h-5 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Logout -->
      <div class="absolute bottom-0 w-full p-3 border-t border-parchment-700/50">
        <button (click)="logout.emit()"
                class="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-parchment-400 hover:bg-parchment-800/50 hover:text-coral-300 transition-all duration-200 text-sm">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25z"/>
            <path fill-rule="evenodd" d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10z"/>
          </svg>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  readonly collapsed = input(false);
  readonly logout = output();

  menuItems = [
    { path: '/dashboard', label: 'Dashboard', exact: true, icon: this.dashboardIcon },
    { path: '/expenses', label: 'Expenses', exact: false, icon: this.expensesIcon },
    { path: '/categories', label: 'Categories', exact: false, icon: this.categoriesIcon },
    { path: '/budgets', label: 'Budgets', exact: false, icon: this.budgetsIcon },
  ];

  private get dashboardIcon() {
    return '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3z"/><path d="M2 9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9z"/><path d="M2 15a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2z"/><path d="M9 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3z"/><path d="M9 9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9z"/><path d="M9 15a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z"/></svg>';
  }
  private get expensesIcon() {
    return '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h5.19a.75.75 0 0 1 0 1.5H7.56l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0z" clip-rule="evenodd"/></svg>';
  }
  private get categoriesIcon() {
    return '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4z"/><path d="M14 3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2z"/><path d="M4 13a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H4z"/><path d="M14 13a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2z"/></svg>';
  }
  private get budgetsIcon() {
    return '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm.75-13a.75.75 0 0 0-1.5 0v.5a3.5 3.5 0 0 0 0 7h.5a2 2 0 0 1 0 4H8.5a.75.75 0 0 0 0 1.5h1.25a.75.75 0 0 0 0-1.5h-.25a3.5 3.5 0 0 1 0-7h.5a2 2 0 0 1 0 4h-.5a.75.75 0 0 0 0 1.5h.25a3.5 3.5 0 0 0 0-7h-.5a2 2 0 0 1 0-4h1.25a.75.75 0 0 0 0-1.5H10.75v-.5z" clip-rule="evenodd"/></svg>';
  }
}

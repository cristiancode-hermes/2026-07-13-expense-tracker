import { Component, OnInit, signal, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ExpenseService } from '../../services/expense.service';
import { KpiCardComponent } from '../../shared/kpi-card/kpi-card.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, KpiCardComponent, HeaderComponent],
  template: `
    <div class="min-h-screen bg-parchment-50 dark:bg-[#1c1712]">
      <app-header title="Dashboard" [userName]="userName" (toggleSidebar)="toggleSidebar.set(!toggleSidebar())" />

      <main class="p-6 anim-fade-up">
        @if (loading()) {
          <div class="flex items-center justify-center h-64">
            <div class="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        } @else {
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
            <div class="anim-stagger-1">
              <app-kpi-card
                icon='<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>'
                label="Total Spent" [value]="totalSpent()" trend="All time" />
            </div>
            <div class="anim-stagger-2">
              <app-kpi-card
                icon='<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/></svg>'
                label="This Month" [value]="monthlyTotal()" trend="Current period" />
            </div>
            <div class="anim-stagger-3">
              <app-kpi-card
                icon='<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>'
                label="Transactions" [value]="transactionCount()" trend="This month" />
            </div>
            <div class="anim-stagger-4">
              <app-kpi-card
                icon='<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"/><path d="M3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/><path d="M14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>'
                label="Categories" [value]="categoryCount()" trend="Active" />
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Category Breakdown -->
            <div class="lg:col-span-2 surface-raised rounded-xl p-6 anim-fade-up">
              <h3 class="font-display text-base text-parchment-800 dark:text-parchment-100 mb-5">Spending by Category</h3>
              @for (cat of categoryData(); track cat.name) {
                <div class="mb-4 last:mb-0">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-sm text-parchment-600 dark:text-parchment-300">{{ cat.name }}</span>
                    <span class="text-sm font-semibold text-parchment-800 dark:text-parchment-100 font-mono">{{ cat.total | currency }}</span>
                  </div>
                  <div class="w-full bg-parchment-200 dark:bg-parchment-800 rounded-full h-2 overflow-hidden">
                    <div class="h-2 rounded-full transition-all duration-500 ease-out-expo"
                         [style.width.%]="cat.percent"
                         [style.background]="cat.color"></div>
                  </div>
                </div>
              }
              @empty {
                <p class="text-parchment-400 text-sm">No expenses recorded yet.</p>
              }
            </div>

            <!-- Recent Expenses -->
            <div class="surface-raised rounded-xl p-6 anim-fade-up">
              <h3 class="font-display text-base text-parchment-800 dark:text-parchment-100 mb-4">Recent Expenses</h3>
              <div class="space-y-3">
                @for (exp of recentExpenses(); track exp.id) {
                  <div class="flex items-center justify-between p-2.5 hover:bg-parchment-50 dark:hover:bg-parchment-900/20 rounded-lg transition-colors">
                    <div>
                      <p class="text-sm font-medium text-parchment-800 dark:text-parchment-100">{{ exp.description }}</p>
                      <p class="text-xs text-parchment-400 font-mono">{{ exp.date | date:'shortDate' }}</p>
                    </div>
                    <span class="text-sm font-semibold text-parchment-800 dark:text-parchment-100 font-mono">{{ exp.amount | currency }}</span>
                  </div>
                } @empty {
                  <p class="text-parchment-400 text-sm">No recent expenses.</p>
                }
              </div>
              <a routerLink="/expenses" class="block mt-4 text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                View all expenses →
              </a>
            </div>
          </div>
        }
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private expenseService = inject(ExpenseService);

  readonly toggleSidebar = signal(false);
  readonly loading = signal(true);
  readonly totalSpent = signal('');
  readonly monthlyTotal = signal('');
  readonly transactionCount = signal('');
  readonly categoryCount = signal('');
  readonly categoryData = signal<{ name: string; icon: string; color: string; total: number; percent: number }[]>([]);
  readonly recentExpenses = signal<any[]>([]);

  get userName() { return this.auth.currentUser()?.name || ''; }

  ngOnInit() {
    const orgId = this.auth.currentUser()?.organizationId;
    if (!orgId) return;
    this.expenseService.getDashboard(orgId).subscribe({
      next: (stats) => {
        this.totalSpent.set(stats.totalSpent.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
        this.monthlyTotal.set(stats.monthlyTotal.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
        this.transactionCount.set(String(stats.monthlyTotal.count));
        this.categoryCount.set(String(stats.byCategory.length));
        const maxAmount = Math.max(...stats.byCategory.map(c => c.total), 1);
        this.categoryData.set(stats.byCategory.map(c => ({
          name: c.name, icon: '●', color: c.color, total: c.total,
          percent: Math.round((c.total / maxAmount) * 100)
        })));
        this.recentExpenses.set(stats.recentExpenses);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}

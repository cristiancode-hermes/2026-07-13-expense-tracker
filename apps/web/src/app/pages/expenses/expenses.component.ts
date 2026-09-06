import { Component, OnInit, signal, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ExpenseService } from '../../services/expense.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { Expense } from '../../models';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, HeaderComponent],
  template: `
    <div class="min-h-screen bg-parchment-50 dark:bg-[#1c1712]">
      <app-header title="Expenses" [userName]="userName" (toggleSidebar)="toggleSidebar.set(!toggleSidebar())" />

      <main class="p-6">
        <!-- Filters -->
        <div class="flex items-center justify-between mb-6 anim-fade-up">
          <div class="flex gap-2">
            <div class="relative">
              <select #statusFilter (change)="filterByStatus(statusFilter.value)"
                      class="input !w-auto !pr-8 appearance-none">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-parchment-500 pointer-events-none" viewBox="0 0 12 12">
                <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        @if (loading()) {
          <div class="flex justify-center py-12">
            <div class="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        } @else {
          <!-- Table -->
          <div class="surface-raised rounded-xl overflow-hidden anim-fade-up anim-stagger-1">
            <table class="w-full table-ledger">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-parchment-100 dark:divide-parchment-800/20">
                @for (exp of expenses(); track exp.id) {
                  <tr class="transition-colors">
                    <td class="text-sm text-parchment-500 dark:text-parchment-400">{{ exp.date | date:'shortDate' }}</td>
                    <td class="text-sm font-medium text-parchment-800 dark:text-parchment-200">{{ exp.description }}</td>
                    <td class="text-sm text-parchment-500 dark:text-parchment-400">{{ exp.categoryName || '—' }}</td>
                    <td class="text-sm font-semibold text-parchment-900 dark:text-parchment-100 font-mono">{{ exp.amount | currency }}</td>
                    <td>
                      <span class="badge" [class]="statusClass(exp.status)">{{ exp.status }}</span>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="5" class="px-6 py-12 text-center text-parchment-500">No expenses found. Start by adding one!</td></tr>
                }
              </tbody>
            </table>
          </div>
        }
      </main>
    </div>
  `
})
export class ExpensesComponent implements OnInit {
  private auth = inject(AuthService);
  private expenseService = inject(ExpenseService);

  readonly toggleSidebar = signal(false);
  readonly loading = signal(true);
  readonly expenses = signal<Expense[]>([]);

  get userName() { return this.auth.currentUser()?.name || ''; }

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses(status = '') {
    const orgId = this.auth.currentUser()?.organizationId;
    if (!orgId) return;
    this.expenseService.getByOrganization(orgId, { status: status || undefined })
      .subscribe({
        next: (data) => { this.expenses.set(data); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
  }

  filterByStatus(status: string) {
    this.loading.set(true);
    this.loadExpenses(status);
  }

  statusClass(status: string): string {
    switch (status) {
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-danger';
      default: return 'badge-warning';
    }
  }
}

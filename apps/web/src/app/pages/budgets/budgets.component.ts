import { Component, OnInit, signal, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { BudgetService } from '../../services/budget.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { BudgetVsActual } from '../../models';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CurrencyPipe, HeaderComponent],
  template: `
    <div class="min-h-screen bg-parchment-50 dark:bg-[#1c1712]">
      <app-header title="Budgets" [userName]="userName" (toggleSidebar)="toggleSidebar.set(!toggleSidebar())" />
      <main class="p-6">
        @if (loading()) {
          <div class="flex justify-center py-12">
            <div class="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        } @else if (budgets().length === 0) {
          <div class="text-center py-16">
            <svg class="w-16 h-16 mx-auto mb-4 text-parchment-300 dark:text-parchment-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <p class="text-parchment-500">No budgets defined yet.</p>
          </div>
        } @else {
          <!-- Asymmetric card layout -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Featured / biggest budget first -->
            @if (budgets()[0]; as featured) {
              <div class="lg:col-span-2 surface-raised rounded-xl p-6 anim-fade-up">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="font-display text-lg text-parchment-800 dark:text-parchment-100">{{ featured.name }}</h3>
                    <p class="text-sm text-parchment-500 mt-0.5">{{ featured.categoryName }}</p>
                  </div>
                  <span class="badge text-xs"
                        [class]="featured.utilization > 80 ? 'badge-danger' : featured.utilization > 50 ? 'badge-warning' : 'badge-success'">
                    {{ featured.utilization }}%
                  </span>
                </div>
                <div class="w-full bg-parchment-100 dark:bg-parchment-800/30 rounded-full h-3 mb-3 overflow-hidden">
                  <div class="h-3 rounded-full transition-all duration-500 ease-out-expo"
                       [style.width.%]="Math.min(featured.utilization, 100)"
                       [class]="featured.utilization > 80 ? 'bg-coral-500' : 'bg-emerald-500'">
                  </div>
                </div>
                <div class="flex justify-between text-sm font-medium">
                  <span class="text-parchment-600 dark:text-parchment-400">{{ featured.spent | currency }} <span class="font-normal text-parchment-400">spent</span></span>
                  <span class="text-parchment-600 dark:text-parchment-400">{{ featured.budgetAmount | currency }} <span class="font-normal text-parchment-400">budget</span></span>
                </div>
              </div>
            }

            <!-- Secondary budgets in compact cards -->
            <div class="space-y-4 anim-fade-up anim-stagger-1">
              @for (budget of budgets().slice(1); track budget.id; let i = $index) {
                <div class="surface-raised rounded-xl p-4"
                     [class.anim-fade-up]="true"
                     [style.animation-delay]="(i * 60) + 'ms'">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-sm text-parchment-800 dark:text-parchment-200">{{ budget.name }}</span>
                    <span class="badge text-[0.65rem]"
                          [class]="budget.utilization > 80 ? 'badge-danger' : budget.utilization > 50 ? 'badge-warning' : 'badge-success'">
                      {{ budget.utilization }}%
                    </span>
                  </div>
                  <p class="text-xs text-parchment-500 mb-2">{{ budget.categoryName }}</p>
                  <div class="w-full bg-parchment-100 dark:bg-parchment-800/30 rounded-full h-2 mb-2 overflow-hidden">
                    <div class="h-2 rounded-full transition-all duration-500 ease-out-expo"
                         [style.width.%]="Math.min(budget.utilization, 100)"
                         [class]="budget.utilization > 80 ? 'bg-coral-500' : 'bg-emerald-500'">
                    </div>
                  </div>
                  <div class="flex justify-between text-xs text-parchment-500">
                    <span>{{ budget.spent | currency }}</span>
                    <span>{{ budget.budgetAmount | currency }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </main>
    </div>
  `
})
export class BudgetsComponent implements OnInit {
  private auth = inject(AuthService);
  private budgetService = inject(BudgetService);

  readonly toggleSidebar = signal(false);
  readonly loading = signal(true);
  readonly budgets = signal<BudgetVsActual[]>([]);
  readonly Math = Math;

  get userName() { return this.auth.currentUser()?.name || ''; }

  ngOnInit() {
    const orgId = this.auth.currentUser()?.organizationId;
    if (orgId) {
      this.budgetService.getAnalysis(orgId).subscribe({
        next: (data) => { this.budgets.set(data); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    }
  }
}

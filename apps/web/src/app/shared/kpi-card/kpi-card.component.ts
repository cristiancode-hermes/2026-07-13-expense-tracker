import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  template: `
    <div class="surface-raised rounded-xl p-5 transition-all duration-300 ease-out-expo
                hover:shadow-[0_8px_24px_rgb(30_26_20/0.08)] hover:-translate-y-0.5
                dark:hover:shadow-[0_8px_24px_rgb(0_0_0/0.4)]">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400"
             [innerHTML]="icon()">
        </div>
        <span class="badge badge-neutral text-[0.6875rem]">{{ trend() }}</span>
      </div>
      <div class="font-display text-2xl text-parchment-900 dark:text-parchment-100 mb-0.5">{{ value() }}</div>
      <div class="text-sm text-parchment-500">{{ label() }}</div>
    </div>
  `
})
export class KpiCardComponent {
  readonly icon = input('<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-13a1 1 0 1 0-2 0v.5a3.5 3.5 0 0 0 0 7h.5a2 2 0 0 1 0 4H8.5a1 1 0 1 0 0 2h1.25a1 1 0 1 0 0-2h-.25a3.5 3.5 0 0 1 0-7h.5a2 2 0 0 1 0 4h-.5a1 1 0 1 0 0 2h.25a3.5 3.5 0 0 0 0-7h-.5a2 2 0 0 1 0-4h1.25a1 1 0 1 0 0-2H10.75V5z"/></svg>');
  readonly label = input('');
  readonly value = input('');
  readonly trend = input('');
}

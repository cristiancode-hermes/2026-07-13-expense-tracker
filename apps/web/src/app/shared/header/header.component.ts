import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="sticky top-0 z-30 surface px-6 py-3.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button (click)="toggleSidebar.emit()"
                  class="lg:hidden p-2 rounded-lg text-parchment-600 hover:bg-parchment-100 dark:hover:bg-parchment-800/50 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h2 class="font-display text-lg text-parchment-800 dark:text-parchment-100">{{ title() }}</h2>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-parchment-500 dark:text-parchment-400">{{ userName() }}</span>
          <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-medium font-display">
            {{ userName().charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  readonly title = input('');
  readonly userName = input('');
  readonly toggleSidebar = output();
}

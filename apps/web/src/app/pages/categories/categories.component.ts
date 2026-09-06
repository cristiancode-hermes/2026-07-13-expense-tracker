import { Component, OnInit, signal, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { Category } from '../../models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [HeaderComponent],
  template: `
    <div class="min-h-screen bg-parchment-50 dark:bg-[#1c1712]">
      <app-header title="Categories" [userName]="userName" (toggleSidebar)="toggleSidebar.set(!toggleSidebar())" />
      <main class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (cat of categories(); track cat.id; let i = $index) {
            <div class="surface-raised rounded-xl p-5 anim-fade-up"
                 [style.animation-delay]="(i * 60) + 'ms'">
              <div class="flex items-center gap-3 mb-3">
                <!-- Color dot with palette matching -->
                <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                     [style.background]="cat.color + '20'">
                  <span class="w-4 h-4 rounded-md" [style.background]="cat.color"></span>
                </div>
                <div class="min-w-0">
                  <h3 class="font-medium text-parchment-800 dark:text-parchment-200 truncate">{{ cat.name }}</h3>
                  <p class="text-xs text-parchment-500">{{ cat.isActive ? 'Active' : 'Inactive' }}</p>
                </div>
              </div>
              <!-- Color palette swatch footer -->
              <div class="flex gap-1.5 mt-2 pt-3 border-t border-parchment-100 dark:border-parchment-800/20">
                <span class="w-4 h-1.5 rounded-full" [style.background]="cat.color"></span>
                <span class="w-4 h-1.5 rounded-full" [style.background]="cat.color + '80'"></span>
                <span class="w-4 h-1.5 rounded-full" [style.background]="cat.color + '40'"></span>
                <span class="text-[0.65rem] text-parchment-400 ml-auto font-mono">{{ cat.color }}</span>
              </div>
            </div>
          } @empty {
            <div class="col-span-full text-center py-16">
              <svg class="w-16 h-16 mx-auto mb-4 text-parchment-300 dark:text-parchment-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 3h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
                <path d="M8 21h8"/>
                <path d="M12 17v4"/>
              </svg>
              <p class="text-parchment-500">No categories defined yet.</p>
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  private auth = inject(AuthService);
  private categoryService = inject(CategoryService);

  readonly toggleSidebar = signal(false);
  readonly categories = signal<Category[]>([]);

  get userName() { return this.auth.currentUser()?.name || ''; }

  ngOnInit() {
    const orgId = this.auth.currentUser()?.organizationId;
    if (orgId) {
      this.categoryService.getByOrganization(orgId).subscribe(data => this.categories.set(data));
    }
  }
}

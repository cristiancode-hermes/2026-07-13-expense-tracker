import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(private db: DatabaseService) {}

  async seed() {
    const orgCount = this.db.get('SELECT COUNT(*) as count FROM organizations');
    if (orgCount.count > 0) {
      console.log('Database already seeded, skipping.');
      return;
    }

    this.db.transaction(() => {
      // Create organizations
      this.db.run("INSERT INTO organizations (id, name) VALUES ('org-acme', 'Acme Corp')");
      this.db.run("INSERT INTO organizations (id, name) VALUES ('org-globex', 'Globex Inc')");

      // Create users
      const hash1 = bcrypt.hashSync('password123', 10);
      this.db.run(
        "INSERT INTO users (id, organizationId, name, email, passwordHash, role) VALUES (?, ?, ?, ?, ?, ?)",
        ['user-admin', 'org-acme', 'Admin User', 'admin@acme.com', hash1, 'admin']
      );
      this.db.run(
        "INSERT INTO users (id, organizationId, name, email, passwordHash, role) VALUES (?, ?, ?, ?, ?, ?)",
        ['user-jane', 'org-acme', 'Jane Smith', 'jane@acme.com', hash1, 'member']
      );
      this.db.run(
        "INSERT INTO users (id, organizationId, name, email, passwordHash, role) VALUES (?, ?, ?, ?, ?, ?)",
        ['user-bob', 'org-globex', 'Bob Johnson', 'bob@globex.com', hash1, 'admin']
      );

      // Create categories
      const categories = [
        ['cat-meals', 'org-acme', 'Meals & Dining', '🍽️', '#10b981'],
        ['cat-transport', 'org-acme', 'Transportation', '🚗', '#3b82f6'],
        ['cat-office', 'org-acme', 'Office Supplies', '📎', '#f59e0b'],
        ['cat-software', 'org-acme', 'Software & Tools', '💻', '#8b5cf6'],
        ['cat-travel', 'org-acme', 'Travel', '✈️', '#ef4444'],
        ['cat-utilities', 'org-acme', 'Utilities', '⚡', '#06b6d4'],
        ['cat-other', 'org-acme', 'Other', '📦', '#6b7280'],
      ];
      for (const [id, orgId, name, icon, color] of categories) {
        this.db.run(
          "INSERT INTO categories (id, organizationId, name, icon, color) VALUES (?, ?, ?, ?, ?)",
          [id, orgId, name, icon, color]
        );
      }

      // Same categories for Globex
      const gcats = [
        ['cat-g-meals', 'org-globex', 'Meals & Dining', '🍽️', '#10b981'],
        ['cat-g-transport', 'org-globex', 'Transportation', '🚗', '#3b82f6'],
        ['cat-g-office', 'org-globex', 'Office Supplies', '📎', '#f59e0b'],
      ];
      for (const [id, orgId, name, icon, color] of gcats) {
        this.db.run(
          "INSERT INTO categories (id, organizationId, name, icon, color) VALUES (?, ?, ?, ?, ?)",
          [id, orgId, name, icon, color]
        );
      }

      // Create expenses
      const expenses = [
        ['exp-1', 'org-acme', 'user-jane', 'cat-meals', 45.50, 'Team lunch', '2026-07-01'],
        ['exp-2', 'org-acme', 'user-jane', 'cat-transport', 120.00, 'Uber to client meeting', '2026-07-02'],
        ['exp-3', 'org-acme', 'user-admin', 'cat-software', 299.00, 'Figma subscription', '2026-07-03'],
        ['exp-4', 'org-acme', 'user-jane', 'cat-office', 35.99, 'Office chair cushion', '2026-07-05'],
        ['exp-5', 'org-acme', 'user-admin', 'cat-travel', 580.00, 'Flight to conference', '2026-07-08'],
        ['exp-6', 'org-acme', 'user-jane', 'cat-meals', 23.40, 'Coffee with client', '2026-07-10'],
        ['exp-7', 'org-acme', 'user-admin', 'cat-software', 199.00, 'AWS hosting', '2026-07-12'],
        ['exp-8', 'org-globex', 'user-bob', 'cat-g-meals', 67.80, 'Business dinner', '2026-07-04'],
        ['exp-9', 'org-globex', 'user-bob', 'cat-g-transport', 35.00, 'Taxi to airport', '2026-07-06'],
        ['exp-10', 'org-globex', 'user-bob', 'cat-g-office', 89.50, 'Printer toner', '2026-07-09'],
      ];
      for (const [id, orgId, userId, catId, amount, desc, date] of expenses) {
        this.db.run(
          "INSERT INTO expenses (id, organizationId, userId, categoryId, amount, description, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [id, orgId, userId, catId, amount, desc, date, 'approved']
        );
      }

      // Create budgets
      this.db.run(
        "INSERT INTO budgets (id, organizationId, categoryId, name, amount, period, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        ['budget-1', 'org-acme', 'cat-meals', 'Monthly Meals Budget', 2000, 'monthly', '2026-07-01', '2026-07-31']
      );
      this.db.run(
        "INSERT INTO budgets (id, organizationId, categoryId, name, amount, period, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        ['budget-2', 'org-acme', 'cat-software', 'Software Budget Q3', 5000, 'quarterly', '2026-07-01', '2026-09-30']
      );
      this.db.run(
        "INSERT INTO budgets (id, organizationId, categoryId, name, amount, period, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        ['budget-3', 'org-acme', 'cat-travel', 'Travel Budget Q3', 10000, 'quarterly', '2026-07-01', '2026-09-30']
      );
      this.db.run(
        "INSERT INTO budgets (id, organizationId, name, amount, period, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ['budget-4', 'org-acme', 'General Contingency', 3000, 'monthly', '2026-07-01', '2026-07-31']
      );
    });

    console.log('Seed data inserted successfully!');
    console.log('  Organizations: Acme Corp, Globex Inc');
    console.log('  Users: admin@acme.com / password123, jane@acme.com / password123');
    console.log('  Expenses: 10 entries across 2 organizations');
    console.log('  Budgets: 4 budgets');
  }
}

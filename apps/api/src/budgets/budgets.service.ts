import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BudgetsService {
  constructor(private db: DatabaseService) {}

  findAll(orgId: string) {
    return this.db.query(
      `SELECT b.*, c.name as categoryName, c.color as categoryColor
       FROM budgets b LEFT JOIN categories c ON b.categoryId = c.id
       WHERE b.organizationId = ? AND b.isActive = 1 ORDER BY b.startDate DESC`,
      [orgId]
    );
  }

  findById(id: string) {
    return this.db.get(
      `SELECT b.*, c.name as categoryName
       FROM budgets b LEFT JOIN categories c ON b.categoryId = c.id
       WHERE b.id = ?`,
      [id]
    );
  }

  create(data: {
    organizationId: string; categoryId?: string; name: string;
    amount: number; period: string; startDate: string; endDate: string;
  }) {
    const result = this.db.run(
      'INSERT INTO budgets (organizationId, categoryId, name, amount, period, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.organizationId, data.categoryId || null, data.name, data.amount, data.period, data.startDate, data.endDate]
    );
    return this.findById(result.lastInsertRowid as string);
  }

  update(id: string, data: {
    categoryId?: string; name?: string; amount?: number;
    period?: string; startDate?: string; endDate?: string;
  }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (data.categoryId !== undefined) { fields.push('categoryId = ?'); values.push(data.categoryId); }
    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.amount !== undefined) { fields.push('amount = ?'); values.push(data.amount); }
    if (data.period !== undefined) { fields.push('period = ?'); values.push(data.period); }
    if (data.startDate !== undefined) { fields.push('startDate = ?'); values.push(data.startDate); }
    if (data.endDate !== undefined) { fields.push('endDate = ?'); values.push(data.endDate); }
    if (fields.length > 0) {
      fields.push("updatedAt = datetime('now')");
      this.db.run(`UPDATE budgets SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
    }
    return this.findById(id);
  }

  remove(id: string) {
    this.db.run("UPDATE budgets SET isActive = 0, updatedAt = datetime('now') WHERE id = ?", [id]);
  }

  getBudgetVsActual(orgId: string) {
    return this.db.query(
      `SELECT b.id, b.name, b.amount as budgetAmount, c.name as categoryName,
              COALESCE(SUM(CASE WHEN e.status != 'rejected' THEN e.amount ELSE 0 END), 0) as spent,
              ROUND((COALESCE(SUM(CASE WHEN e.status != 'rejected' THEN e.amount ELSE 0 END), 0) / b.amount) * 100, 1) as utilization
       FROM budgets b
       LEFT JOIN categories c ON b.categoryId = c.id
       LEFT JOIN expenses e ON e.categoryId = c.id AND e.organizationId = b.organizationId
       WHERE b.organizationId = ? AND b.isActive = 1
       GROUP BY b.id ORDER BY utilization DESC`,
      [orgId]
    );
  }
}

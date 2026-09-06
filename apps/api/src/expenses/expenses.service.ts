import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ExpensesService {
  constructor(private db: DatabaseService) {}

  findAll(orgId: string, filters?: { categoryId?: string; status?: string; startDate?: string; endDate?: string }) {
    let sql = 'SELECT e.*, c.name as categoryName, u.name as userName FROM expenses e LEFT JOIN categories c ON e.categoryId = c.id LEFT JOIN users u ON e.userId = u.id WHERE e.organizationId = ?';
    const params: any[] = [orgId];
    if (filters?.categoryId) { sql += ' AND e.categoryId = ?'; params.push(filters.categoryId); }
    if (filters?.status) { sql += ' AND e.status = ?'; params.push(filters.status); }
    if (filters?.startDate) { sql += ' AND e.date >= ?'; params.push(filters.startDate); }
    if (filters?.endDate) { sql += ' AND e.date <= ?'; params.push(filters.endDate); }
    sql += ' ORDER BY e.date DESC';
    return this.db.query(sql, params);
  }

  findById(id: string) {
    return this.db.get(
      'SELECT e.*, c.name as categoryName, u.name as userName FROM expenses e LEFT JOIN categories c ON e.categoryId = c.id LEFT JOIN users u ON e.userId = u.id WHERE e.id = ?',
      [id]
    );
  }

  create(data: {
    organizationId: string; userId: string; categoryId?: string;
    amount: number; description: string; date: string;
    isReimbursable?: boolean; receiptPath?: string;
  }) {
    const result = this.db.run(
      `INSERT INTO expenses (organizationId, userId, categoryId, amount, description, date, isReimbursable, receiptPath)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.organizationId, data.userId, data.categoryId || null, data.amount,
       data.description, data.date, data.isReimbursable ? 1 : 0, data.receiptPath || null]
    );
    return this.findById(result.lastInsertRowid as string);
  }

  update(id: string, data: {
    categoryId?: string; amount?: number; description?: string;
    date?: string; status?: string; isReimbursable?: boolean;
  }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (data.categoryId !== undefined) { fields.push('categoryId = ?'); values.push(data.categoryId); }
    if (data.amount !== undefined) { fields.push('amount = ?'); values.push(data.amount); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.date !== undefined) { fields.push('date = ?'); values.push(data.date); }
    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
    if (data.isReimbursable !== undefined) { fields.push('isReimbursable = ?'); values.push(data.isReimbursable ? 1 : 0); }
    if (fields.length > 0) {
      fields.push("updatedAt = datetime('now')");
      this.db.run(`UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
    }
    return this.findById(id);
  }

  remove(id: string) {
    this.db.run('DELETE FROM expenses WHERE id = ?', [id]);
  }

  getDashboardStats(orgId: string) {
    const totalSpent = this.db.get(
      "SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE organizationId = ? AND status != 'rejected'",
      [orgId]
    );
    const byCategory = this.db.query(
      `SELECT c.id, c.name, c.color, COALESCE(SUM(e.amount), 0) as total, COUNT(e.id) as count
       FROM categories c LEFT JOIN expenses e ON e.categoryId = c.id AND e.organizationId = ?
       WHERE c.organizationId = ? AND c.isActive = 1
       GROUP BY c.id ORDER BY total DESC`,
      [orgId, orgId]
    );
    const recentExpenses = this.db.query(
      `SELECT e.*, c.name as categoryName FROM expenses e
       LEFT JOIN categories c ON e.categoryId = c.id
       WHERE e.organizationId = ? ORDER BY e.createdAt DESC LIMIT 10`,
      [orgId]
    );
    const monthlyTotal = this.db.get(
      "SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count FROM expenses WHERE organizationId = ? AND strftime('%Y-%m', date) = strftime('%Y-%m', 'now') AND status != 'rejected'",
      [orgId]
    );
    return { totalSpent: totalSpent.total, byCategory, recentExpenses, monthlyTotal };
  }
}

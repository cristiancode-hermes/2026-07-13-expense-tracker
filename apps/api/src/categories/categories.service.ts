import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategoriesService {
  constructor(private db: DatabaseService) {}

  findAll(orgId: string) {
    return this.db.query(
      'SELECT * FROM categories WHERE organizationId = ? AND isActive = 1 ORDER BY name',
      [orgId]
    );
  }

  findById(id: string) {
    return this.db.get('SELECT * FROM categories WHERE id = ?', [id]);
  }

  create(data: { organizationId: string; name: string; icon?: string; color?: string }) {
    const result = this.db.run(
      'INSERT INTO categories (organizationId, name, icon, color) VALUES (?, ?, ?, ?)',
      [data.organizationId, data.name, data.icon || null, data.color || null]
    );
    return this.findById(result.lastInsertRowid as string);
  }

  update(id: string, data: { name?: string; icon?: string; color?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.icon !== undefined) { fields.push('icon = ?'); values.push(data.icon); }
    if (data.color !== undefined) { fields.push('color = ?'); values.push(data.color); }
    if (fields.length > 0) {
      fields.push("updatedAt = datetime('now')");
      this.db.run(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
    }
    return this.findById(id);
  }

  remove(id: string) {
    this.db.run("UPDATE categories SET isActive = 0, updatedAt = datetime('now') WHERE id = ?", [id]);
  }
}

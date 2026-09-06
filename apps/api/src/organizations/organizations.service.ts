import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrganizationsService {
  constructor(private db: DatabaseService) {}

  findAll() {
    return this.db.query('SELECT * FROM organizations WHERE isActive = 1 ORDER BY name');
  }

  findById(id: string) {
    return this.db.get('SELECT * FROM organizations WHERE id = ?', [id]);
  }

  create(data: { name: string }) {
    const result = this.db.run(
      'INSERT INTO organizations (name) VALUES (?)',
      [data.name]
    );
    return this.findById(result.lastInsertRowid as string);
  }

  update(id: string, data: { name?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (fields.length > 0) {
      fields.push("updatedAt = datetime('now')");
      this.db.run(
        `UPDATE organizations SET ${fields.join(', ')} WHERE id = ?`,
        [...values, id]
      );
    }
    return this.findById(id);
  }

  remove(id: string) {
    this.db.run("UPDATE organizations SET isActive = 0, updatedAt = datetime('now') WHERE id = ?", [id]);
  }
}

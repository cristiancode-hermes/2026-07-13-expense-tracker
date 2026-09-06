import { Injectable, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async create(data: { name: string; email: string; password: string; organizationId: string; role?: string }) {
    const existing = this.db.get('SELECT id FROM users WHERE email = ?', [data.email]);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const result = this.db.run(
      'INSERT INTO users (name, email, passwordHash, organizationId, role) VALUES (?, ?, ?, ?, ?)',
      [data.name, data.email, passwordHash, data.organizationId, data.role || 'member']
    );
    return this.db.get('SELECT id, name, email, role, organizationId, createdAt FROM users WHERE id = ?', [result.lastInsertRowid]);
  }

  findByEmail(email: string) {
    return this.db.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  findById(id: string) {
    return this.db.get('SELECT id, name, email, role, organizationId, createdAt FROM users WHERE id = ?', [id]);
  }

  findByOrganization(orgId: string) {
    return this.db.query('SELECT id, name, email, role, createdAt FROM users WHERE organizationId = ?', [orgId]);
  }

  update(id: string, data: { name?: string; role?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.role !== undefined) { fields.push('role = ?'); values.push(data.role); }
    if (fields.length > 0) {
      fields.push("updatedAt = datetime('now')");
      this.db.run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
    }
    return this.findById(id);
  }

  remove(id: string) {
    this.db.run('DELETE FROM users WHERE id = ?', [id]);
  }
}

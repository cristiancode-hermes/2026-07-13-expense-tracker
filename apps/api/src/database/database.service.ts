import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Database = require('better-sqlite3');

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db!: Database.Database;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const dbPath = this.config.get<string>('DATABASE_URL', './data/app.db');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.createTables();
  }

  private createTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS organizations (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        organizationId TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member' CHECK(role IN ('admin', 'member')),
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        organizationId TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        organizationId TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        categoryId TEXT REFERENCES categories(id) ON DELETE SET NULL,
        amount REAL NOT NULL CHECK(amount > 0),
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        receiptPath TEXT,
        isReimbursable INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        organizationId TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        categoryId TEXT REFERENCES categories(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        amount REAL NOT NULL CHECK(amount > 0),
        period TEXT NOT NULL CHECK(period IN ('monthly', 'quarterly', 'yearly')),
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS receipts (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        expenseId TEXT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
        fileName TEXT NOT NULL,
        filePath TEXT NOT NULL,
        mimeType TEXT NOT NULL,
        fileSize INTEGER NOT NULL,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
  }

  query(sql: string, params?: any[]): any[] {
    const stmt = this.db.prepare(sql);
    return params ? stmt.all(...params) : stmt.all();
  }

  get(sql: string, params?: any[]): any {
    const stmt = this.db.prepare(sql);
    return params ? stmt.get(...params) : stmt.get();
  }

  run(sql: string, params?: any[]): { changes: number; lastInsertRowid: any } {
    const stmt = this.db.prepare(sql);
    const result = params ? stmt.run(...params) : stmt.run();
    return { changes: result.changes, lastInsertRowid: result.lastInsertRowid };
  }

  transaction(fn: () => void): void {
    this.db.transaction(fn)();
  }
}

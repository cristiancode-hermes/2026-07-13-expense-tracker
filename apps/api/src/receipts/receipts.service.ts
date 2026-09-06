import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReceiptsService {
  constructor(private db: DatabaseService) {}

  findByExpense(expenseId: string) {
    return this.db.query('SELECT * FROM receipts WHERE expenseId = ?', [expenseId]);
  }

  findById(id: string) {
    return this.db.get('SELECT * FROM receipts WHERE id = ?', [id]);
  }

  create(data: { expenseId: string; fileName: string; filePath: string; mimeType: string; fileSize: number }) {
    const result = this.db.run(
      'INSERT INTO receipts (expenseId, fileName, filePath, mimeType, fileSize) VALUES (?, ?, ?, ?, ?)',
      [data.expenseId, data.fileName, data.filePath, data.mimeType, data.fileSize]
    );
    return this.findById(result.lastInsertRowid as string);
  }

  remove(id: string) {
    this.db.run('DELETE FROM receipts WHERE id = ?', [id]);
  }
}

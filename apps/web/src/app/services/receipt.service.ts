import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReceiptService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getByExpense(expenseId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/receipts/expense/${expenseId}`);
  }

  create(data: { expenseId: string; fileName: string; filePath: string; mimeType: string; fileSize: number }) {
    return this.http.post<any>(`${this.apiUrl}/receipts`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/receipts/${id}`);
  }
}

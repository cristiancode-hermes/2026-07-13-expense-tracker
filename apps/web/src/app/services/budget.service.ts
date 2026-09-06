import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Budget, BudgetVsActual } from '../models';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getByOrganization(orgId: string) {
    return this.http.get<Budget[]>(`${this.apiUrl}/budgets/organization/${orgId}`);
  }

  getAnalysis(orgId: string) {
    return this.http.get<BudgetVsActual[]>(`${this.apiUrl}/budgets/analysis/${orgId}`);
  }

  create(data: any) {
    return this.http.post<Budget>(`${this.apiUrl}/budgets`, data);
  }

  update(id: string, data: any) {
    return this.http.patch<Budget>(`${this.apiUrl}/budgets/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/budgets/${id}`);
  }
}

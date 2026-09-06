import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense, DashboardStats } from '../models';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private apiUrl = 'http://localhost:3000/api';
  readonly expenses = signal<Expense[]>([]);
  readonly loading = signal(false);

  constructor(private http: HttpClient) {}

  getByOrganization(orgId: string, filters?: any) {
    this.loading.set(true);
    let params: any = {};
    if (filters?.categoryId) params.categoryId = filters.categoryId;
    if (filters?.status) params.status = filters.status;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    return this.http.get<Expense[]>(`${this.apiUrl}/expenses/organization/${orgId}`, { params });
  }

  getDashboard(orgId: string) {
    return this.http.get<DashboardStats>(`${this.apiUrl}/expenses/dashboard/${orgId}`);
  }

  getById(id: string) {
    return this.http.get<Expense>(`${this.apiUrl}/expenses/${id}`);
  }

  create(data: any) {
    return this.http.post<Expense>(`${this.apiUrl}/expenses`, data);
  }

  update(id: string, data: any) {
    return this.http.patch<Expense>(`${this.apiUrl}/expenses/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/expenses/${id}`);
  }
}

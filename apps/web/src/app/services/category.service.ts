import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api';
  readonly categories = signal<Category[]>([]);

  constructor(private http: HttpClient) {}

  getByOrganization(orgId: string) {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/organization/${orgId}`);
  }

  create(data: any) {
    return this.http.post<Category>(`${this.apiUrl}/categories`, data);
  }

  update(id: string, data: any) {
    return this.http.patch<Category>(`${this.apiUrl}/categories/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }
}

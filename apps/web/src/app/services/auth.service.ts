import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthResponse, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
      this.isAuthenticated.set(true);
    }
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(name: string, email: string, password: string, organizationId: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { name, email, password, organizationId });
  }

  setSession(auth: AuthResponse) {
    localStorage.setItem('token', auth.accessToken);
    localStorage.setItem('user', JSON.stringify(auth.user));
    this.currentUser.set(auth.user);
    this.isAuthenticated.set(true);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

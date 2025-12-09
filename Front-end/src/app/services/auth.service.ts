import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  setToken(token: string): void {
    localStorage.setItem('adminToken', token);
  }

  clearToken(): void {
    localStorage.removeItem('adminToken');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing session on init
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch {
        this.clearSession();
      }
    }
  }

  // User login (for regular users)
  loginUser(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/user/login`, { email, password });
  }

  // Admin login (for admin dashboard)
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password });
  }

  // Register new user
  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { username, email, password });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }

  // Set user session after login
  setUserSession(response: AuthResponse): void {
    if (response.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('userToken', response.token || '');
      this.currentUserSubject.next(response.user);
    }
  }

  // Clear session on logout
  clearSession(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    this.currentUserSubject.next(null);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser') || !!localStorage.getItem('adminToken');
  }

  // Check if current user is admin
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'ADMIN' || !!localStorage.getItem('adminToken');
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Admin token methods (for backward compatibility)
  getToken(): string | null {
    return localStorage.getItem('adminToken') || localStorage.getItem('userToken');
  }

  setToken(token: string): void {
    localStorage.setItem('adminToken', token);
  }

  clearToken(): void {
    localStorage.removeItem('adminToken');
  }
}

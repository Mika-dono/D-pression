import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Teams
  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teams`);
  }

  // Events
  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events`);
  }

  // Products
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  // Memberships
  getMemberships(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/memberships`);
  }

  // Posts/News
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts`);
  }

  // Admin - Login (deprecated - use AuthService instead)
  adminLogin(credentials: any): Observable<any> {
    return this.http.post(`http://localhost:8080/auth/login`, credentials);
  }

  // Admin - Get Scrim Requests
  getScrimRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/scrims`);
  }

  // Admin - Update Scrim Status
  updateScrimStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/scrims/${id}`, { status });
  }

  // Admin - Save Schedule
  saveSchedule(schedule: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/schedule`, schedule);
  }

  // Admin - Save Events
  saveEvents(events: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/events`, events);
  }

  // Admin - Save Matches
  saveMatches(matches: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/matches`, matches);
  }
}

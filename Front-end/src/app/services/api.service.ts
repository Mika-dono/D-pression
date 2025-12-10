import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) { }

  // =============== TEAMS ===============
  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teams`);
  }

  // =============== EVENTS ===============
  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events`);
  }

  getUpcomingEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events/upcoming`);
  }

  createEvent(event: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events`, event);
  }

  updateEvent(id: number, event: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/events/${id}`, event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${id}`);
  }

  // =============== MATCHES ===============
  getMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/matches`);
  }

  getVisibleMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/matches/visible`);
  }

  getUpcomingMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/matches/upcoming`);
  }

  createMatch(match: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/matches`, match);
  }

  updateMatch(id: number, match: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/matches/${id}`, match);
  }

  toggleMatchVisibility(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/matches/${id}/toggle`, {});
  }

  deleteMatch(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/matches/${id}`);
  }

  // =============== SCHEDULES ===============
  getSchedules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/schedules`);
  }

  getScheduleByDay(day: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/schedules/day/${day}`);
  }

  saveScheduleByDay(schedule: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/schedules/day`, schedule);
  }

  createSchedule(schedule: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/schedules`, schedule);
  }

  updateSchedule(id: number, schedule: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/schedules/${id}`, schedule);
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/schedules/${id}`);
  }

  // =============== SCRIMS ===============
  getScrims(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/scrims`);
  }

  getScrimsByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/scrims/status/${status}`);
  }

  createScrim(scrim: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/scrims`, scrim);
  }

  updateScrim(id: number, scrim: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/scrims/${id}`, scrim);
  }

  deleteScrim(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/scrims/${id}`);
  }

  // =============== PRODUCTS ===============
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  // =============== MEMBERSHIPS ===============
  getMemberships(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/memberships`);
  }

  // =============== POSTS/NEWS ===============
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts`);
  }

  // =============== AUTH ===============
  adminLogin(credentials: any): Observable<any> {
    return this.http.post(`http://localhost:8081/auth/login`, credentials);
  }
}

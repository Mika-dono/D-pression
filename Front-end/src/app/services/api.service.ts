import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) { }

  // =============== USERS ===============
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  getUsersByRole(role: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/role/${role}`);
  }

  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/stats`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, user);
  }

  toggleUserActive(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/toggle-active`, {});
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // =============== TEAMS ===============
  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teams`);
  }

  getTeamById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/teams/${id}`);
  }

  getTeamsByGame(game: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teams/game/${game}`);
  }

  createTeam(team: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teams`, team);
  }

  updateTeam(id: number, team: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/teams/${id}`, team);
  }

  deleteTeam(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teams/${id}`);
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

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}`);
  }

  getProductsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/category/${category}`);
  }

  getFeaturedProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/featured`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  // =============== MEMBERSHIPS ===============
  getMemberships(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/memberships`);
  }

  getMembershipById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/memberships/${id}`);
  }

  getActiveMemberships(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/memberships/active`);
  }

  createMembership(membership: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/memberships`, membership);
  }

  updateMembership(id: number, membership: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/memberships/${id}`, membership);
  }

  deleteMembership(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/memberships/${id}`);
  }

  // =============== POSTS/NEWS ===============
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts`);
  }

  getPostById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${id}`);
  }

  getPostsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts/category/${category}`);
  }

  getPublishedPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts/published`);
  }

  createPost(post: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, post);
  }

  updatePost(id: number, post: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${id}`);
  }

  // =============== PAYMENTS ===============
  getPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payments`);
  }

  // =============== AUTH ===============
  adminLogin(credentials: any): Observable<any> {
    return this.http.post(`http://localhost:8081/auth/login`, credentials);
  }
}

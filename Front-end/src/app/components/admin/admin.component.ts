import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isLoggedIn = false;
  adminName = '';
  credentials = { username: '', password: '' };
  activeSection = 'dashboard';
  sections = ['dashboard', 'schedule', 'events', 'matches', 'scrims', 'objectives'];
  
  scrimRequests: any[] = [];
  selectedDay = 'LUNDI';
  schedule: any = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Check if already logged in (from localStorage)
    const saved = localStorage.getItem('adminName');
    if (saved) {
      this.adminName = saved;
      this.isLoggedIn = true;
      this.loadScrimRequests();
    }
  }

  login(): void {
    this.apiService.adminLogin(this.credentials).subscribe({
      next: (response) => {
        this.adminName = this.credentials.username;
        localStorage.setItem('adminName', this.adminName);
        this.isLoggedIn = true;
        this.loadScrimRequests();
        this.credentials = { username: '', password: '' };
      },
      error: (err) => {
        alert('Identifiants incorrects');
        console.error(err);
      }
    });
  }

  logout(): void {
    this.isLoggedIn = false;
    this.adminName = '';
    localStorage.removeItem('adminName');
  }

  switchSection(section: string): void {
    this.activeSection = section;
  }

  loadScrimRequests(): void {
    this.apiService.getScrimRequests().subscribe({
      next: (data) => this.scrimRequests = data,
      error: (err) => console.error('Erreur scrims:', err)
    });
  }

  updateScrimStatus(id: string, status: string): void {
    this.apiService.updateScrimStatus(id, status).subscribe({
      next: () => {
        this.loadScrimRequests();
        alert(`Scrim ${status}`);
      },
      error: (err) => console.error('Erreur update:', err)
    });
  }

  saveSchedule(): void {
    this.apiService.saveSchedule(this.schedule).subscribe({
      next: () => alert('Planning mis à jour'),
      error: (err) => console.error('Erreur save:', err)
    });
  }

  getBadgeClass(status: string): string {
    switch(status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  getPendingCount(): number {
    return this.scrimRequests.filter(s => s.status === 'pending').length;
  }

  getApprovedCount(): number {
    return this.scrimRequests.filter(s => s.status === 'approved').length;
  }

  getRejectedCount(): number {
    return this.scrimRequests.filter(s => s.status === 'rejected').length;
  }
}
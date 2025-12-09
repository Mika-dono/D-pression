import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  events: any[] = [];
  selectedFilter = 'all';
  eventTypes = ['all', 'match', 'scrim', 'fanmeet'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.apiService.getEvents().subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error('Erreur events:', err)
    });
  }

  getFilteredEvents(): any[] {
    if (this.selectedFilter === 'all') {
      return this.events;
    }
    return this.events.filter(e => e.type === this.selectedFilter);
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatTime(time: any): string {
    if (!time) return '';
    const d = new Date(time);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
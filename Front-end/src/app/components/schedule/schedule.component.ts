import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, AfterViewInit {
  events: any[] = [];
  selectedFilter = 'all';
  eventTypes = ['all', 'match', 'tournament', 'scrim', 'fanmeet', 'stream'];
  
  // Vue calendrier
  currentMonth = new Date();
  calendarDays: any[] = [];
  viewMode: 'list' | 'calendar' = 'list';

  constructor(private apiService: ApiService, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.loadEvents();
    this.generateCalendar();
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
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

  getUpcomingEvents(): any[] {
    const now = new Date();
    return this.getFilteredEvents()
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }

  getPastEvents(): any[] {
    const now = new Date();
    return this.getFilteredEvents()
      .filter(e => new Date(e.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatTime(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  getDay(date: any): string {
    if (!date) return '';
    return new Date(date).getDate().toString().padStart(2, '0');
  }

  getMonth(date: any): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'match': '⚔️',
      'tournament': '🏆',
      'scrim': '🎯',
      'fanmeet': '🤝',
      'stream': '📺'
    };
    return icons[type?.toLowerCase()] || '📅';
  }

  getTypeBadgeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'match': 'badge-match',
      'tournament': 'badge-tournament',
      'scrim': 'badge-scrim',
      'fanmeet': 'badge-fanmeet',
      'stream': 'badge-stream'
    };
    return classes[type?.toLowerCase()] || 'badge-default';
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'calendar' : 'list';
  }

  generateCalendar(): void {
    // Simplified calendar generation
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    this.calendarDays = [];
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dayEvents = this.events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate.getDate() === i && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year;
      });
      
      this.calendarDays.push({
        date: i,
        events: dayEvents,
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
  }

  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  private initScrollAnimations(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll').forEach((el: Element) => {
      observer.observe(el);
    });
  }
}
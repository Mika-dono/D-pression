import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import gsap from 'gsap';

interface ScheduleData {
  [key: string]: { start: string; end: string; description: string };
}

interface Event {
  id?: number;
  title: string;
  type: string;
  date: string;
  time: string;
  description?: string;
}

interface Match {
  id?: number;
  tournament: string;
  format: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  hidden: boolean;
}

interface ScrimRequest {
  id?: number;
  opponent: string;
  description?: string;
  date: string;
  status: string;
  game?: string;
  notes?: string;
}

interface DashboardStats {
  totalEvents: number;
  totalMatches: number;
  pendingScrims: number;
  weeklyTraining: number;
}

interface NavSection {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  // Expose Object to template
  Object = Object;
  
  // Auth
  isLoggedIn = false;
  adminName = '';
  credentials = { username: '', password: '' };
  loginError = '';
  isLoggingIn = false;

  // UI
  activeSection = 'dashboard';
  sidebarCollapsed = false;
  showMobileMenu = false;
  currentTime = new Date();
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
  selectedFilter = 'all';
  
  // Dashboard
  dashboardStats: DashboardStats = {
    totalEvents: 0,
    totalMatches: 0,
    pendingScrims: 0,
    weeklyTraining: 0
  };

  // Navigation sections
  navSections: NavSection[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'weekly', label: 'Planning', icon: '📅' },
    { id: 'events', label: 'Événements', icon: '⭐' },
    { id: 'matches', label: 'Matchs', icon: '🏆' },
    { id: 'scrims', label: 'Scrims', icon: '🎮' },
    { id: 'analytics', label: 'Analytiques', icon: '📈' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' }
  ];

  // Schedule
  selectedDay = 'LUNDI';
  schedule: ScheduleData = {};
  dayForm = { day: 'LUNDI', start: '21:00', end: '00:00', description: "Session d'entraînement" };

  // Objectives
  weeklyObjectives = '';

  // Events
  events: Event[] = [];
  eventForm = { title: '', type: 'tournament', date: '', time: '', desc: '' };

  // Matches
  matches: Match[] = [];
  matchForm = { tournament: '', format: 'Bo1', team1: '', team2: '', date: '', time: '' };

  // Scrims
  scrimRequests: ScrimRequest[] = [];

  // Toast
  showToastNotification = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('adminName');
    if (saved) {
      this.adminName = saved;
      this.isLoggedIn = true;
      this.initializeAllData();
    }
    
    // Update time every minute
    setInterval(() => this.currentTime = new Date(), 60000);
  }

  ngAfterViewInit(): void {
    if (this.isLoggedIn) {
      this.initAnimations();
    }
  }

  initAnimations(): void {
    setTimeout(() => {
      gsap.fromTo('.stat-card', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
      gsap.fromTo('.admin-panel', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }
      );
    }, 100);
  }

  // =============== AUTH ===============
  login(): void {
    this.isLoggingIn = true;
    this.loginError = '';
    
    this.apiService.adminLogin(this.credentials).subscribe({
      next: () => {
        this.adminName = this.credentials.username;
        localStorage.setItem('adminName', this.adminName);
        this.isLoggedIn = true;
        this.initializeAllData();
        this.credentials = { username: '', password: '' };
        this.showToast('Bienvenue ' + this.adminName + ' !', 'success');
        this.isLoggingIn = false;
        setTimeout(() => this.initAnimations(), 100);
      },
      error: () => {
        this.loginError = 'Identifiants incorrects';
        this.isLoggingIn = false;
        gsap.fromTo('.login-card', 
          { x: -10 },
          { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power1.inOut' }
        );
      }
    });
  }

  logout(): void {
    this.isLoggedIn = false;
    this.adminName = '';
    localStorage.removeItem('adminName');
    this.showToast('Déconnexion réussie', 'success');
  }

  initializeAllData(): void {
    this.loadSchedule();
    this.loadObjectives();
    this.loadEvents();
    this.loadMatches();
    this.loadScrimRequests();
  }

  updateDashboardStats(): void {
    this.dashboardStats = {
      totalEvents: this.events.length,
      totalMatches: this.matches.length,
      pendingScrims: this.scrimRequests.filter(s => s.status === 'PENDING').length,
      weeklyTraining: Object.keys(this.schedule).length
    };
    
    // Update nav badges
    this.navSections = this.navSections.map(section => {
      if (section.id === 'scrims') {
        return { ...section, badge: this.dashboardStats.pendingScrims };
      }
      return section;
    });
  }

  // =============== SCHEDULE (API) ===============
  loadSchedule(): void {
    this.apiService.getSchedules().subscribe({
      next: (data) => {
        this.schedule = {};
        data.forEach((s: any) => {
          this.schedule[s.dayOfWeek] = {
            start: s.startTime || '21:00',
            end: s.endTime || '00:00',
            description: s.activity || "Session d'entraînement"
          };
        });
        this.fillDay(this.selectedDay);
        this.updateDashboardStats();
      },
      error: () => {
        // Fallback to localStorage if API fails
        this.schedule = this.getScheduleFromLocalStorage();
        this.fillDay(this.selectedDay);
        this.updateDashboardStats();
      }
    });
  }

  saveScheduleForm(): void {
    const scheduleData = {
      dayOfWeek: this.dayForm.day,
      startTime: this.dayForm.start,
      endTime: this.dayForm.end,
      activity: this.dayForm.description
    };
    
    this.apiService.saveScheduleByDay(scheduleData).subscribe({
      next: () => {
        this.schedule[this.dayForm.day] = {
          start: this.dayForm.start,
          end: this.dayForm.end,
          description: this.dayForm.description
        };
        this.updateDashboardStats();
        this.showToast('Planning mis à jour (DB)', 'success');
      },
      error: () => {
        // Fallback to localStorage
        this.schedule[this.dayForm.day] = {
          start: this.dayForm.start,
          end: this.dayForm.end,
          description: this.dayForm.description
        };
        this.saveScheduleToLocalStorage(this.schedule);
        this.updateDashboardStats();
        this.showToast('Planning mis à jour (local)', 'warning');
      }
    });
  }

  fillDay(day: string): void {
    const data = this.schedule[day] || { start: '21:00', end: '00:00', description: "Session d'entraînement" };
    this.dayForm.day = day;
    this.dayForm.start = data.start;
    this.dayForm.end = data.end;
    this.dayForm.description = data.description;
    this.selectedDay = day;
  }

  // LocalStorage fallback methods for schedule
  getScheduleFromLocalStorage(): ScheduleData {
    try {
      const raw = localStorage.getItem('cgk_weekly_schedule');
      const parsed = raw ? JSON.parse(raw) : {};
      return Array.isArray(parsed) ? {} : parsed;
    } catch {
      return {};
    }
  }

  saveScheduleToLocalStorage(schedule: ScheduleData): void {
    try {
      localStorage.setItem('cgk_weekly_schedule', JSON.stringify(schedule));
    } catch { /* ignore */ }
  }

  // =============== OBJECTIVES (localStorage) ===============
  loadObjectives(): void {
    this.weeklyObjectives = localStorage.getItem('cgk_weekly_objectives') || '';
  }

  saveObjectives(): void {
    try {
      localStorage.setItem('cgk_weekly_objectives', this.weeklyObjectives);
    } catch { /* ignore */ }
    this.showToast('Objectifs enregistrés', 'success');
  }

  // =============== EVENTS (API) ===============
  loadEvents(): void {
    this.apiService.getEvents().subscribe({
      next: (data) => {
        this.events = data.map((e: any) => ({
          id: e.id,
          title: e.title,
          type: e.type || 'tournament',
          date: e.date ? e.date.split('T')[0] : '',
          time: e.time || (e.date ? e.date.split('T')[1]?.substring(0, 5) : ''),
          description: e.description
        }));
        this.updateDashboardStats();
      },
      error: () => {
        this.events = [];
        this.updateDashboardStats();
      }
    });
  }

  addEvent(): void {
    if (!this.eventForm.title || !this.eventForm.date) {
      this.showToast('Veuillez remplir tous les champs requis', 'error');
      return;
    }
    
    const eventData = {
      title: this.eventForm.title,
      type: this.eventForm.type || 'tournament',
      date: `${this.eventForm.date}T${this.eventForm.time || '00:00'}:00`,
      time: this.eventForm.time,
      description: this.eventForm.desc || ''
    };
    
    this.apiService.createEvent(eventData).subscribe({
      next: (created) => {
        this.events.push({
          id: created.id,
          title: created.title,
          type: created.type,
          date: this.eventForm.date,
          time: this.eventForm.time,
          description: created.description
        });
        this.eventForm = { title: '', type: 'tournament', date: '', time: '', desc: '' };
        this.updateDashboardStats();
        this.showToast('Événement créé dans la DB ✅', 'success');
      },
      error: (err) => {
        console.error('Error creating event:', err);
        this.showToast('Erreur lors de la création', 'error');
      }
    });
  }

  deleteEvent(id: number | undefined): void {
    if (!id) return;
    
    this.apiService.deleteEvent(id).subscribe({
      next: () => {
        this.events = this.events.filter(ev => ev.id !== id);
        this.updateDashboardStats();
        this.showToast('Événement supprimé de la DB', 'warning');
      },
      error: () => {
        this.showToast('Erreur lors de la suppression', 'error');
      }
    });
  }

  labelEvent(type: string): string {
    const map: { [key: string]: string } = {
      tournament: 'Tournoi',
      scrim: 'Scrim',
      training: 'Entraînement',
      meeting: 'Réunion'
    };
    return map[type] || type;
  }

  getEventIcon(type: string): string {
    const icons: { [key: string]: string } = {
      tournament: '🏆',
      scrim: '🎮',
      training: '💪',
      meeting: '👥'
    };
    return icons[type] || '📅';
  }

  // =============== MATCHES (API) ===============
  loadMatches(): void {
    this.apiService.getMatches().subscribe({
      next: (data) => {
        this.matches = data.map((m: any) => ({
          id: m.id,
          tournament: m.tournament,
          format: m.format || 'Bo1',
          team1: m.team1,
          team2: m.team2,
          date: m.date ? m.date.split('T')[0] : '',
          time: m.time || (m.date ? m.date.split('T')[1]?.substring(0, 5) : ''),
          hidden: m.hidden || false
        }));
        this.updateDashboardStats();
      },
      error: () => {
        this.matches = [];
        this.updateDashboardStats();
      }
    });
  }

  addMatch(): void {
    if (!this.matchForm.tournament || !this.matchForm.team1 || !this.matchForm.team2) {
      this.showToast('Veuillez remplir tous les champs requis', 'error');
      return;
    }
    
    const matchData = {
      tournament: this.matchForm.tournament,
      format: this.matchForm.format || 'Bo1',
      team1: this.matchForm.team1,
      team2: this.matchForm.team2,
      date: `${this.matchForm.date || new Date().toISOString().split('T')[0]}T${this.matchForm.time || '00:00'}:00`,
      time: this.matchForm.time,
      hidden: false
    };
    
    this.apiService.createMatch(matchData).subscribe({
      next: (created) => {
        this.matches.push({
          id: created.id,
          tournament: created.tournament,
          format: created.format,
          team1: created.team1,
          team2: created.team2,
          date: this.matchForm.date,
          time: this.matchForm.time,
          hidden: false
        });
        this.matchForm = { tournament: '', format: 'Bo1', team1: '', team2: '', date: '', time: '' };
        this.updateDashboardStats();
        this.showToast('Match programmé dans la DB ✅', 'success');
      },
      error: (err) => {
        console.error('Error creating match:', err);
        this.showToast('Erreur lors de la création', 'error');
      }
    });
  }

  deleteMatch(id: number | undefined): void {
    if (!id) return;
    
    this.apiService.deleteMatch(id).subscribe({
      next: () => {
        this.matches = this.matches.filter(m => m.id !== id);
        this.updateDashboardStats();
        this.showToast('Match supprimé de la DB', 'warning');
      },
      error: () => {
        this.showToast('Erreur lors de la suppression', 'error');
      }
    });
  }

  toggleMatch(id: number | undefined): void {
    if (!id) return;
    
    this.apiService.toggleMatchVisibility(id).subscribe({
      next: (updated) => {
        const match = this.matches.find(m => m.id === id);
        if (match) {
          match.hidden = updated.hidden;
          this.showToast(match.hidden ? 'Match masqué' : 'Match visible', 'success');
        }
      },
      error: () => {
        this.showToast('Erreur lors de la mise à jour', 'error');
      }
    });
  }

  // =============== SCRIMS (API) ===============
  loadScrimRequests(): void {
    this.apiService.getScrims().subscribe({
      next: (data) => {
        this.scrimRequests = data.map((s: any) => ({
          id: s.id,
          opponent: s.opponent,
          description: s.description,
          date: s.date ? s.date.split('T')[0] : '',
          status: s.status || 'PENDING',
          game: s.game,
          notes: s.notes
        }));
        this.updateDashboardStats();
      },
      error: () => {
        this.scrimRequests = [];
        this.updateDashboardStats();
      }
    });
  }

  updateScrim(id: number | undefined, status: string): void {
    if (!id) return;
    
    const request = this.scrimRequests.find(r => r.id === id);
    if (!request) return;
    
    const updatedScrim = { ...request, status: status.toUpperCase() };
    
    this.apiService.updateScrim(id, updatedScrim).subscribe({
      next: () => {
        request.status = status.toUpperCase();
        this.updateDashboardStats();
        this.showToast(`Demande ${status === 'accepted' ? 'acceptée' : 'refusée'}`, status === 'accepted' ? 'success' : 'warning');
      },
      error: () => {
        this.showToast('Erreur lors de la mise à jour', 'error');
      }
    });
  }

  // =============== UTILITIES ===============
  switchSection(section: string): void {
    this.activeSection = section;
    this.showMobileMenu = false;
    
    gsap.fromTo('.admin-panel, .stat-card', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
    );
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  getSectionTitle(): string {
    const titles: { [key: string]: string } = {
      dashboard: 'Tableau de bord',
      weekly: 'Planning Hebdomadaire',
      objectives: 'Objectifs de la Semaine',
      events: 'Gestion des Événements',
      matches: 'Gestion des Matchs',
      scrims: 'Demandes de Scrims',
      analytics: 'Analytiques',
      settings: 'Paramètres'
    };
    return titles[this.activeSection] || 'Administration';
  }

  formatDate(date: string): string {
    if (!date) return 'Date à définir';
    const d = new Date(`${date}T00:00:00`);
    if (Number.isNaN(d.getTime())) return 'Date à définir';
    return d.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(time: string): string {
    return time || '--:--';
  }

  getRelativeDate(date: string): string {
    if (!date) return '';
    const now = new Date();
    const eventDate = new Date(`${date}T00:00:00`);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Demain';
    if (diffDays < 0) return `Il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
    if (diffDays <= 7) return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    return '';
  }

  badgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      APPROVED: 'badge-accepted',
      accepted: 'badge-accepted',
      REJECTED: 'badge-rejected',
      rejected: 'badge-rejected',
      PENDING: 'badge-pending',
      pending: 'badge-pending'
    };
    return classes[status] || 'badge-pending';
  }

  labelStatus(status: string): string {
    const map: { [key: string]: string } = {
      PENDING: 'En attente',
      pending: 'En attente',
      APPROVED: 'Acceptée',
      accepted: 'Acceptée',
      REJECTED: 'Refusée',
      rejected: 'Refusée'
    };
    return map[status] || status;
  }

  showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToastNotification = true;
    setTimeout(() => this.showToastNotification = false, 3000);
  }

  getSortedEvents(): Event[] {
    return [...this.events].sort(
      (a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime()
    );
  }

  getUpcomingEvents(): Event[] {
    const now = new Date();
    return this.getSortedEvents().filter(e => new Date(`${e.date}T${e.time || '00:00'}`) >= now).slice(0, 5);
  }

  getSortedMatches(): Match[] {
    return [...this.matches].sort(
      (a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime()
    );
  }

  getUpcomingMatches(): Match[] {
    const now = new Date();
    return this.getSortedMatches().filter(m => !m.hidden && new Date(`${m.date}T${m.time || '00:00'}`) >= now).slice(0, 3);
  }

  getFilteredScrims(): ScrimRequest[] {
    if (this.selectedFilter === 'all') return this.scrimRequests;
    const statusMap: { [key: string]: string } = {
      pending: 'PENDING',
      accepted: 'APPROVED',
      rejected: 'REJECTED'
    };
    return this.scrimRequests.filter(r => r.status === statusMap[this.selectedFilter]);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }
}

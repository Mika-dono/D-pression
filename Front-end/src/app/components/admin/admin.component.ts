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
  id: string | number;
  title: string;
  type: string;
  date: string;
  time: string;
  desc: string;
}

interface Match {
  id: string | number;
  tournament: string;
  format: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  hidden: boolean;
}

interface ScrimRequest {
  id: string | number;
  teamName: string;
  teamEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  level: string;
  preferredDates: string;
  details: string;
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
    this.updateDashboardStats();
  }

  updateDashboardStats(): void {
    this.dashboardStats = {
      totalEvents: this.events.length,
      totalMatches: this.matches.length,
      pendingScrims: this.scrimRequests.filter(s => s.status === 'pending').length,
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

  // =============== SCHEDULE ===============
  loadSchedule(): void {
    this.schedule = this.getSchedule();
    this.dayForm.day = this.selectedDay;
    this.fillDay(this.selectedDay);
  }

  saveScheduleForm(): void {
    this.schedule[this.dayForm.day] = {
      start: this.dayForm.start,
      end: this.dayForm.end,
      description: this.dayForm.description
    };
    this.saveSchedule(this.schedule);
    this.loadSchedule();
    this.updateDashboardStats();
    this.showToast('Planning mis à jour', 'success');
  }

  fillDay(day: string): void {
    const data = this.schedule[day] || { start: '21:00', end: '00:00', description: "Session d'entraînement" };
    this.dayForm.day = day;
    this.dayForm.start = data.start;
    this.dayForm.end = data.end;
    this.dayForm.description = data.description;
    this.selectedDay = day;
  }

  getSchedule(): ScheduleData {
    try {
      const raw = localStorage.getItem('cgk_weekly_schedule');
      const parsed = raw ? JSON.parse(raw) : {};
      return Array.isArray(parsed) ? {} : parsed;
    } catch {
      return {};
    }
  }

  saveSchedule(schedule: ScheduleData): void {
    try {
      localStorage.setItem('cgk_weekly_schedule', JSON.stringify(schedule));
    } catch {
      /* ignore */
    }
  }

  // =============== OBJECTIVES ===============
  loadObjectives(): void {
    this.weeklyObjectives = localStorage.getItem('cgk_weekly_objectives') || '';
  }

  saveObjectives(): void {
    try {
      localStorage.setItem('cgk_weekly_objectives', this.weeklyObjectives);
    } catch {
      /* ignore */
    }
    this.showToast('Objectifs enregistrés', 'success');
  }

  // =============== EVENTS ===============
  loadEvents(): void {
    this.events = this.getEvents();
  }

  addEvent(): void {
    if (!this.eventForm.title || !this.eventForm.date) {
      this.showToast('Veuillez remplir tous les champs requis', 'error');
      return;
    }
    const newEvent: Event = {
      id: this.generateId(),
      title: this.eventForm.title,
      type: this.eventForm.type || 'tournament',
      date: this.eventForm.date,
      time: this.eventForm.time,
      desc: this.eventForm.desc || ''
    };
    this.events.push(newEvent);
    this.saveEvents(this.events);
    this.eventForm = { title: '', type: 'tournament', date: '', time: '', desc: '' };
    this.updateDashboardStats();
    this.showToast('Événement créé avec succès', 'success');
  }

  deleteEvent(id: string | number): void {
    this.events = this.events.filter(ev => `${ev.id}` !== `${id}`);
    this.saveEvents(this.events);
    this.updateDashboardStats();
    this.showToast('Événement supprimé', 'warning');
  }

  getEvents(): Event[] {
    try {
      const raw = localStorage.getItem('cgk_events');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveEvents(events: Event[]): void {
    try {
      localStorage.setItem('cgk_events', JSON.stringify(events));
    } catch {
      /* ignore */
    }
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

  // =============== MATCHES ===============
  loadMatches(): void {
    this.matches = this.getMatches();
  }

  addMatch(): void {
    if (!this.matchForm.tournament || !this.matchForm.team1 || !this.matchForm.team2) {
      this.showToast('Veuillez remplir tous les champs requis', 'error');
      return;
    }
    const newMatch: Match = {
      id: this.generateId(),
      tournament: this.matchForm.tournament,
      format: this.matchForm.format || 'Bo1',
      team1: this.matchForm.team1,
      team2: this.matchForm.team2,
      date: this.matchForm.date,
      time: this.matchForm.time,
      hidden: false
    };
    this.matches.push(newMatch);
    this.saveMatches(this.matches);
    this.matchForm = { tournament: '', format: 'Bo1', team1: '', team2: '', date: '', time: '' };
    this.updateDashboardStats();
    this.showToast('Match programmé avec succès', 'success');
  }

  deleteMatch(id: string | number): void {
    this.matches = this.matches.filter(m => `${m.id}` !== `${id}`);
    this.saveMatches(this.matches);
    this.updateDashboardStats();
    this.showToast('Match supprimé', 'warning');
  }

  toggleMatch(id: string | number): void {
    const match = this.matches.find(m => `${m.id}` === `${id}`);
    if (match) {
      match.hidden = !match.hidden;
      this.saveMatches(this.matches);
      this.showToast(match.hidden ? 'Match masqué' : 'Match visible', 'success');
    }
  }

  getMatches(): Match[] {
    try {
      const raw = localStorage.getItem('cgk_matches');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveMatches(matches: Match[]): void {
    try {
      localStorage.setItem('cgk_matches', JSON.stringify(matches));
    } catch {
      /* ignore */
    }
  }

  // =============== SCRIMS ===============
  loadScrimRequests(): void {
    this.scrimRequests = this.getScrimRequests();
  }

  updateScrim(id: string | number, status: 'accepted' | 'rejected'): void {
    const request = this.scrimRequests.find(r => `${r.id}` === `${id}`);
    if (request) {
      request.status = status;
      this.saveScrimRequests(this.scrimRequests);
      this.updateDashboardStats();
      this.showToast(`Demande ${status === 'accepted' ? 'acceptée' : 'refusée'}`, status === 'accepted' ? 'success' : 'warning');
    }
  }

  getScrimRequests(): ScrimRequest[] {
    try {
      const raw = localStorage.getItem('cgk_scrim_requests');
      let parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed) || !parsed.length) {
        parsed = this.seedScrims();
      }
      return parsed.map((r: ScrimRequest, index: number) => ({
        id: r.id ?? index,
        teamName: r.teamName || 'Équipe inconnue',
        teamEmail: r.teamEmail || 'non renseigné',
        status: ['pending', 'accepted', 'rejected'].includes(r.status) ? r.status : 'pending',
        level: r.level || 'N/C',
        preferredDates: r.preferredDates || '',
        details: r.details || ''
      }));
    } catch {
      return this.seedScrims();
    }
  }

  saveScrimRequests(list: ScrimRequest[]): void {
    try {
      localStorage.setItem('cgk_scrim_requests', JSON.stringify(list));
    } catch {
      /* ignore */
    }
  }

  seedScrims(): ScrimRequest[] {
    const seed: ScrimRequest[] = [
      {
        id: 1,
        teamName: 'Kitsune Esports',
        teamEmail: 'contact@kitsune.gg',
        status: 'pending',
        level: 'Master',
        preferredDates: 'Vendredi soir',
        details: 'Scrim Bo3, draft coachée souhaitée.'
      },
      {
        id: 2,
        teamName: 'Orca Gaming',
        teamEmail: 'team@orca.gg',
        status: 'accepted',
        level: 'Diamond',
        preferredDates: 'Samedi après-midi',
        details: 'Préparation pour les qualifications.'
      },
      {
        id: 3,
        teamName: 'Phoenix Rising',
        teamEmail: 'manager@phoenix.gg',
        status: 'pending',
        level: 'Challenger',
        preferredDates: 'Dimanche',
        details: 'Bo5 compétitif, VOD review possible.'
      }
    ];
    this.saveScrimRequests(seed);
    return seed;
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
      accepted: 'badge-accepted',
      rejected: 'badge-rejected',
      pending: 'badge-pending'
    };
    return classes[status] || 'badge-pending';
  }

  labelStatus(status: string): string {
    const map: { [key: string]: string } = {
      pending: 'En attente',
      accepted: 'Acceptée',
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

  generateId(): string | number {
    return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now();
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
    return this.scrimRequests.filter(
      r => this.selectedFilter === 'all' || r.status === this.selectedFilter
    );
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }
}
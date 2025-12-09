import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

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

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  // Auth
  isLoggedIn = false;
  adminName = '';
  credentials = { username: '', password: '' };

  // UI
  activeSection = 'weekly';
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
  selectedFilter = 'all';

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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('adminName');
    if (saved) {
      this.adminName = saved;
      this.isLoggedIn = true;
      this.initializeAllData();
    }
  }

  // =============== AUTH ===============
  login(): void {
    this.apiService.adminLogin(this.credentials).subscribe({
      next: (response) => {
        this.adminName = this.credentials.username;
        localStorage.setItem('adminName', this.adminName);
        this.isLoggedIn = true;
        this.initializeAllData();
        this.credentials = { username: '', password: '' };
        this.showToast('Authentification réussie');
      },
      error: (err) => {
        this.showToast('Identifiants incorrects');
        console.error(err);
      }
    });
  }

  logout(): void {
    this.isLoggedIn = false;
    this.adminName = '';
    localStorage.removeItem('adminName');
    this.showToast('Déconnecté');
  }

  initializeAllData(): void {
    this.loadSchedule();
    this.loadObjectives();
    this.loadEvents();
    this.loadMatches();
    this.loadScrimRequests();
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
    this.showToast('Planning mis à jour');
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
    } catch (e) {
      return {};
    }
  }

  saveSchedule(schedule: ScheduleData): void {
    try {
      localStorage.setItem('cgk_weekly_schedule', JSON.stringify(schedule));
    } catch (e) {
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
    } catch (err) {
      /* ignore */
    }
    this.showToast('Objectifs enregistrés');
  }

  // =============== EVENTS ===============
  loadEvents(): void {
    this.events = this.getEvents();
  }

  addEvent(): void {
    const newEvent: Event = {
      id: this.generateId(),
      title: this.eventForm.title || 'Événement',
      type: this.eventForm.type || 'tournament',
      date: this.eventForm.date,
      time: this.eventForm.time,
      desc: this.eventForm.desc || ''
    };
    this.events.push(newEvent);
    this.saveEvents(this.events);
    this.eventForm = { title: '', type: 'tournament', date: '', time: '', desc: '' };
    this.showToast('Événement ajouté');
  }

  deleteEvent(id: string | number): void {
    this.events = this.events.filter(ev => `${ev.id}` !== `${id}`);
    this.saveEvents(this.events);
    this.showToast('Événement supprimé');
  }

  getEvents(): Event[] {
    try {
      const raw = localStorage.getItem('cgk_events');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  saveEvents(events: Event[]): void {
    try {
      localStorage.setItem('cgk_events', JSON.stringify(events));
    } catch (e) {
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

  // =============== MATCHES ===============
  loadMatches(): void {
    this.matches = this.getMatches();
  }

  addMatch(): void {
    const newMatch: Match = {
      id: this.generateId(),
      tournament: this.matchForm.tournament || 'Tournoi',
      format: this.matchForm.format || 'Bo1',
      team1: this.matchForm.team1 || 'Équipe 1',
      team2: this.matchForm.team2 || 'Équipe 2',
      date: this.matchForm.date,
      time: this.matchForm.time,
      hidden: false
    };
    this.matches.push(newMatch);
    this.saveMatches(this.matches);
    this.matchForm = { tournament: '', format: 'Bo1', team1: '', team2: '', date: '', time: '' };
    this.showToast('Match ajouté');
  }

  deleteMatch(id: string | number): void {
    this.matches = this.matches.filter(m => `${m.id}` !== `${id}`);
    this.saveMatches(this.matches);
    this.showToast('Match supprimé');
  }

  toggleMatch(id: string | number): void {
    const match = this.matches.find(m => `${m.id}` === `${id}`);
    if (match) {
      match.hidden = !match.hidden;
      this.saveMatches(this.matches);
      this.showToast('Visibilité modifiée');
    }
  }

  getMatches(): Match[] {
    try {
      const raw = localStorage.getItem('cgk_matches');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  saveMatches(matches: Match[]): void {
    try {
      localStorage.setItem('cgk_matches', JSON.stringify(matches));
    } catch (e) {
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
      this.showToast(`Demande ${this.labelStatus(status)}`);
    }
  }

  getScrimRequests(): ScrimRequest[] {
    try {
      const raw = localStorage.getItem('cgk_scrim_requests');
      let parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed) || !parsed.length) {
        parsed = this.seedScrims();
      }
      return parsed.map((r: any, index: number) => ({
        id: r.id ?? index,
        teamName: r.teamName || 'Équipe inconnue',
        teamEmail: r.teamEmail || 'non renseigné',
        status: ['pending', 'accepted', 'rejected'].includes(r.status) ? r.status : 'pending',
        level: r.level || 'N/C',
        preferredDates: r.preferredDates || '',
        details: r.details || ''
      }));
    } catch (e) {
      return this.seedScrims();
    }
  }

  saveScrimRequests(list: ScrimRequest[]): void {
    try {
      localStorage.setItem('cgk_scrim_requests', JSON.stringify(list));
    } catch (e) {
      /* ignore */
    }
  }

  seedScrims(): ScrimRequest[] {
    const seed: ScrimRequest[] = [
      {
        id: 1,
        teamName: 'Kitsune',
        teamEmail: 'contact@kitsune.gg',
        status: 'pending',
        level: 'Master',
        preferredDates: 'Vendredi soir',
        details: 'Scrim Bo3, draft coachée.'
      },
      {
        id: 2,
        teamName: 'Orca',
        teamEmail: 'team@orca.gg',
        status: 'accepted',
        level: 'Diamond',
        preferredDates: 'Samedi',
        details: ''
      }
    ];
    this.saveScrimRequests(seed);
    return seed;
  }

  // =============== UTILITIES ===============
  switchSection(section: string): void {
    this.activeSection = section;
  }

  getSectionTitle(): string {
    const titles: { [key: string]: string } = {
      weekly: 'Planning Hebdomadaire',
      objectives: 'Objectifs de la Semaine',
      events: 'Gestion des Événements',
      matches: 'Gestion des Matchs',
      scrims: 'Demandes de Scrims'
    };
    return titles[this.activeSection] || 'Panel Admin';
  }

  getSectionLabel(section: string): string {
    const labels: { [key: string]: string } = {
      weekly: 'Planning',
      objectives: 'Objectifs',
      events: 'Événements',
      matches: 'Matchs',
      scrims: 'Scrims'
    };
    return labels[section] || section;
  }

  formatDate(date: string): string {
    if (!date) return 'Date à définir';
    const d = new Date(`${date}T00:00:00`);
    if (Number.isNaN(d.getTime())) return 'Date à définir';
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  badgeClass(status: string): string {
    if (status === 'accepted') return 'bg-green-700';
    if (status === 'rejected') return 'bg-red-700';
    return 'bg-yellow-700';
  }

  labelStatus(status: string): string {
    const map: { [key: string]: string } = {
      pending: 'En attente',
      accepted: 'Acceptée',
      rejected: 'Refusée'
    };
    return map[status] || status;
  }

  showToast(message: string): void {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  generateId(): string | number {
    return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now();
  }

  getSortedEvents(): Event[] {
    return [...this.events].sort(
      (a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
    );
  }

  getSortedMatches(): Match[] {
    return [...this.matches].sort(
      (a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
    );
  }

  getFilteredScrims(): ScrimRequest[] {
    return this.scrimRequests.filter(
      r => this.selectedFilter === 'all' || r.status === this.selectedFilter
    );
  }
}
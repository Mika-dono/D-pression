import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import gsap from 'gsap';

// =============== INTERFACES ===============
interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
}

interface Team {
  id?: number;
  name: string;
  game: string;
  description?: string;
  winRate?: number;
  logoUrl?: string;
  members?: TeamMember[];
}

interface TeamMember {
  id?: number;
  name: string;
  position: string;
  role?: string;
  championPool?: string;
}

interface Product {
  id?: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  imageUrl?: string;
}

interface Post {
  id?: number;
  title: string;
  excerpt?: string;
  description?: string;
  category: string;
  author: string;
  date: string;
  isPublished: boolean;
  viewCount?: number;
}

interface Membership {
  id?: number;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  benefits?: string;
  isActive: boolean;
}

interface Event {
  id?: number;
  title: string;
  eventType: string;
  date: string;
  time?: string;
  description?: string;
  location?: string;
  status?: string;
}

interface Match {
  id?: number;
  tournament: string;
  format: string;
  team1: string;
  team2: string;
  date: string;
  time?: string;
  score?: string;
  status?: string;
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

interface ScheduleData {
  [key: string]: { start: string; end: string; description: string };
}

interface NavSection {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  category: 'admin' | 'esport' | 'content';
}

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalPosts: number;
  totalRevenue: number;
  totalTeams: number;
  totalEvents: number;
  totalMatches: number;
  pendingScrims: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  Object = Object;
  
  // =============== AUTH ===============
  isLoggedIn = false;
  adminName = '';
  credentials = { username: '', password: '' };
  loginError = '';
  isLoggingIn = false;

  // =============== UI STATE ===============
  activeSection = 'dashboard';
  activeCategory: 'admin' | 'esport' | 'content' = 'admin';
  sidebarCollapsed = false;
  showMobileMenu = false;
  currentTime = new Date();
  
  // Modal states
  showUserModal = false;
  showProductModal = false;
  showPostModal = false;
  showTeamModal = false;
  showMembershipModal = false;
  showEventModal = false;
  showMatchModal = false;
  editMode = false;
  
  // Filters
  userFilter = 'all';
  productFilter = 'all';
  postFilter = 'all';
  scrimFilter = 'all';

  // =============== NAVIGATION ===============
  navSections: NavSection[] = [
    // Administration
    { id: 'dashboard', label: 'Dashboard', icon: '📊', category: 'admin' },
    { id: 'users', label: 'Utilisateurs', icon: '👥', category: 'admin' },
    { id: 'products', label: 'Produits', icon: '🛒', category: 'admin' },
    { id: 'memberships', label: 'Abonnements', icon: '⭐', category: 'admin' },
    { id: 'posts', label: 'Actualités', icon: '📰', category: 'admin' },
    // Esport Management
    { id: 'teams', label: 'Équipes', icon: '🎮', category: 'esport' },
    { id: 'events', label: 'Événements', icon: '📅', category: 'esport' },
    { id: 'matches', label: 'Matchs', icon: '🏆', category: 'esport' },
    { id: 'scrims', label: 'Scrims', icon: '⚔️', category: 'esport' },
    { id: 'schedule', label: 'Planning', icon: '🗓️', category: 'esport' },
    // Settings
    { id: 'settings', label: 'Paramètres', icon: '⚙️', category: 'content' },
  ];

  // =============== DATA ===============
  // Stats
  dashboardStats: DashboardStats = {
    totalUsers: 0,
    totalProducts: 0,
    totalPosts: 0,
    totalRevenue: 0,
    totalTeams: 0,
    totalEvents: 0,
    totalMatches: 0,
    pendingScrims: 0
  };

  // Users
  users: User[] = [];
  userForm: User = { username: '', email: '', role: 'USER', isActive: true };
  userStats: any = {};

  // Teams
  teams: Team[] = [];
  teamForm: Team = { name: '', game: 'lol', description: '', winRate: 0 };

  // Products
  products: Product[] = [];
  productForm: Product = { name: '', description: '', category: 'apparel', price: 0, stock: 0, isFeatured: false };
  productCategories = ['apparel', 'merchandise', 'bundle', 'digital'];

  // Memberships
  memberships: Membership[] = [];
  membershipForm: Membership = { name: '', description: '', price: 0, durationDays: 30, benefits: '', isActive: true };

  // Posts
  posts: Post[] = [];
  postForm: Post = { title: '', excerpt: '', description: '', category: 'esports', author: '', date: '', isPublished: false };
  postCategories = ['esports', 'announcements', 'interviews', 'releases', 'community'];

  // Events
  events: Event[] = [];
  eventForm: Event = { title: '', eventType: 'match', date: '', time: '', description: '', location: '' };
  eventTypes = ['match', 'scrim', 'fanmeet', 'event', 'training'];

  // Matches
  matches: Match[] = [];
  matchForm: Match = { tournament: '', format: 'Bo1', team1: '', team2: '', date: '', time: '', hidden: false };
  matchFormats = ['Bo1', 'Bo3', 'Bo5'];

  // Scrims
  scrims: ScrimRequest[] = [];

  // Schedule
  days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
  selectedDay = 'LUNDI';
  schedule: ScheduleData = {};
  dayForm = { day: 'LUNDI', start: '21:00', end: '00:00', description: "Session d'entraînement" };
  weeklyObjectives = '';

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
    this.loadUsers();
    this.loadTeams();
    this.loadProducts();
    this.loadMemberships();
    this.loadPosts();
    this.loadEvents();
    this.loadMatches();
    this.loadScrims();
    this.loadSchedule();
    this.loadObjectives();
  }

  updateDashboardStats(): void {
    this.dashboardStats = {
      totalUsers: this.users.length,
      totalProducts: this.products.length,
      totalPosts: this.posts.length,
      totalRevenue: this.products.reduce((sum, p) => sum + (p.price * (p.stock > 0 ? 1 : 0)), 0),
      totalTeams: this.teams.length,
      totalEvents: this.events.length,
      totalMatches: this.matches.length,
      pendingScrims: this.scrims.filter(s => s.status === 'PENDING').length
    };
    
    this.navSections = this.navSections.map(section => {
      if (section.id === 'scrims') {
        return { ...section, badge: this.dashboardStats.pendingScrims };
      }
      return section;
    });
  }

  // =============== USERS ===============
  loadUsers(): void {
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loadUserStats();
        this.updateDashboardStats();
      },
      error: () => {
        this.users = [];
        this.updateDashboardStats();
      }
    });
  }

  loadUserStats(): void {
    this.apiService.getUserStats().subscribe({
      next: (stats) => this.userStats = stats,
      error: () => this.userStats = {}
    });
  }

  openUserModal(user?: User): void {
    this.editMode = !!user;
    this.userForm = user ? { ...user } : { username: '', email: '', role: 'USER', isActive: true };
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.userForm = { username: '', email: '', role: 'USER', isActive: true };
  }

  saveUser(): void {
    if (!this.userForm.username || !this.userForm.email) {
      this.showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    if (this.editMode && this.userForm.id) {
      this.apiService.updateUser(this.userForm.id, this.userForm).subscribe({
        next: () => {
          this.loadUsers();
          this.closeUserModal();
          this.showToast('Utilisateur mis à jour', 'success');
        },
        error: () => this.showToast('Erreur lors de la mise à jour', 'error')
      });
    } else {
      const newUser = { ...this.userForm, password: 'password123' };
      this.apiService.createUser(newUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeUserModal();
          this.showToast('Utilisateur créé', 'success');
        },
        error: () => this.showToast('Erreur lors de la création', 'error')
      });
    }
  }

  toggleUserActive(user: User): void {
    if (!user.id) return;
    this.apiService.toggleUserActive(user.id).subscribe({
      next: () => {
        user.isActive = !user.isActive;
        this.showToast(user.isActive ? 'Utilisateur activé' : 'Utilisateur désactivé', 'success');
      },
      error: () => this.showToast('Erreur', 'error')
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    this.apiService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
        this.showToast('Utilisateur supprimé', 'warning');
      },
      error: () => this.showToast('Erreur lors de la suppression', 'error')
    });
  }

  getFilteredUsers(): User[] {
    if (this.userFilter === 'all') return this.users;
    if (this.userFilter === 'active') return this.users.filter(u => u.isActive);
    if (this.userFilter === 'inactive') return this.users.filter(u => !u.isActive);
    return this.users.filter(u => u.role === this.userFilter.toUpperCase());
  }

  // =============== TEAMS ===============
  loadTeams(): void {
    this.apiService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        this.updateDashboardStats();
      },
      error: () => this.teams = []
    });
  }

  openTeamModal(team?: Team): void {
    this.editMode = !!team;
    this.teamForm = team ? { ...team } : { name: '', game: 'lol', description: '', winRate: 0 };
    this.showTeamModal = true;
  }

  closeTeamModal(): void {
    this.showTeamModal = false;
    this.teamForm = { name: '', game: 'lol', description: '', winRate: 0 };
  }

  saveTeam(): void {
    if (!this.teamForm.name || !this.teamForm.game) {
      this.showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    if (this.editMode && this.teamForm.id) {
      this.apiService.updateTeam(this.teamForm.id, this.teamForm).subscribe({
        next: () => {
          this.loadTeams();
          this.closeTeamModal();
          this.showToast('Équipe mise à jour', 'success');
        },
        error: () => this.showToast('Erreur lors de la mise à jour', 'error')
      });
    } else {
      this.apiService.createTeam(this.teamForm).subscribe({
        next: () => {
          this.loadTeams();
          this.closeTeamModal();
          this.showToast('Équipe créée', 'success');
        },
        error: () => this.showToast('Erreur lors de la création', 'error')
      });
    }
  }

  deleteTeam(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) return;
    this.apiService.deleteTeam(id).subscribe({
      next: () => {
        this.loadTeams();
        this.showToast('Équipe supprimée', 'warning');
      },
      error: () => this.showToast('Erreur lors de la suppression', 'error')
    });
  }

  // =============== PRODUCTS ===============
  loadProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.updateDashboardStats();
      },
      error: () => this.products = []
    });
  }

  openProductModal(product?: Product): void {
    this.editMode = !!product;
    this.productForm = product ? { ...product } : { name: '', description: '', category: 'apparel', price: 0, stock: 0, isFeatured: false };
    this.showProductModal = true;
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.productForm = { name: '', description: '', category: 'apparel', price: 0, stock: 0, isFeatured: false };
  }

  saveProduct(): void {
    if (!this.productForm.name || !this.productForm.category) {
      this.showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    if (this.editMode && this.productForm.id) {
      this.apiService.updateProduct(this.productForm.id, this.productForm).subscribe({
        next: () => {
          this.loadProducts();
          this.closeProductModal();
          this.showToast('Produit mis à jour', 'success');
        },
        error: () => this.showToast('Erreur lors de la mise à jour', 'error')
      });
    } else {
      this.apiService.createProduct(this.productForm).subscribe({
        next: () => {
          this.loadProducts();
          this.closeProductModal();
          this.showToast('Produit créé', 'success');
        },
        error: () => this.showToast('Erreur lors de la création', 'error')
      });
    }
  }

  deleteProduct(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    this.apiService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
        this.showToast('Produit supprimé', 'warning');
      },
      error: () => this.showToast('Erreur lors de la suppression', 'error')
    });
  }

  getFilteredProducts(): Product[] {
    if (this.productFilter === 'all') return this.products;
    if (this.productFilter === 'featured') return this.products.filter(p => p.isFeatured);
    if (this.productFilter === 'lowstock') return this.products.filter(p => p.stock < 10);
    return this.products.filter(p => p.category === this.productFilter);
  }

  // =============== MEMBERSHIPS ===============
  loadMemberships(): void {
    this.apiService.getMemberships().subscribe({
      next: (data) => this.memberships = data,
      error: () => this.memberships = []
    });
  }

  openMembershipModal(membership?: Membership): void {
    this.editMode = !!membership;
    this.membershipForm = membership ? { ...membership } : { name: '', description: '', price: 0, durationDays: 30, benefits: '', isActive: true };
    this.showMembershipModal = true;
  }

  closeMembershipModal(): void {
    this.showMembershipModal = false;
    this.membershipForm = { name: '', description: '', price: 0, durationDays: 30, benefits: '', isActive: true };
  }

  saveMembership(): void {
    if (!this.membershipForm.name) {
      this.showToast('Veuillez remplir le nom', 'error');
      return;
    }

    if (this.editMode && this.membershipForm.id) {
      this.apiService.updateMembership(this.membershipForm.id, this.membershipForm).subscribe({
        next: () => {
          this.loadMemberships();
          this.closeMembershipModal();
          this.showToast('Abonnement mis à jour', 'success');
        },
        error: () => this.showToast('Erreur lors de la mise à jour', 'error')
      });
    } else {
      this.apiService.createMembership(this.membershipForm).subscribe({
        next: () => {
          this.loadMemberships();
          this.closeMembershipModal();
          this.showToast('Abonnement créé', 'success');
        },
        error: () => this.showToast('Erreur lors de la création', 'error')
      });
    }
  }

  deleteMembership(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) return;
    this.apiService.deleteMembership(id).subscribe({
      next: () => {
        this.loadMemberships();
        this.showToast('Abonnement supprimé', 'warning');
      },
      error: () => this.showToast('Erreur lors de la suppression', 'error')
    });
  }

  // =============== POSTS ===============
  loadPosts(): void {
    this.apiService.getPosts().subscribe({
      next: (data) => {
        this.posts = data.map((p: any) => ({
          ...p,
          date: p.date ? p.date.split('T')[0] : ''
        }));
        this.updateDashboardStats();
      },
      error: () => this.posts = []
    });
  }

  openPostModal(post?: Post): void {
    this.editMode = !!post;
    this.postForm = post ? { ...post } : { title: '', excerpt: '', description: '', category: 'esports', author: this.adminName, date: new Date().toISOString().split('T')[0], isPublished: false };
    this.showPostModal = true;
  }

  closePostModal(): void {
    this.showPostModal = false;
    this.postForm = { title: '', excerpt: '', description: '', category: 'esports', author: '', date: '', isPublished: false };
  }

  savePost(): void {
    if (!this.postForm.title) {
      this.showToast('Veuillez remplir le titre', 'error');
      return;
    }

    const postData = {
      ...this.postForm,
      date: `${this.postForm.date}T00:00:00`
    };

    if (this.editMode && this.postForm.id) {
      this.apiService.updatePost(this.postForm.id, postData).subscribe({
        next: () => {
          this.loadPosts();
          this.closePostModal();
          this.showToast('Article mis à jour', 'success');
        },
        error: () => this.showToast('Erreur lors de la mise à jour', 'error')
      });
    } else {
      this.apiService.createPost(postData).subscribe({
        next: () => {
          this.loadPosts();
          this.closePostModal();
          this.showToast('Article créé', 'success');
        },
        error: () => this.showToast('Erreur lors de la création', 'error')
      });
    }
  }

  deletePost(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    this.apiService.deletePost(id).subscribe({
      next: () => {
        this.loadPosts();
        this.showToast('Article supprimé', 'warning');
      },
      error: () => this.showToast('Erreur lors de la suppression', 'error')
    });
  }

  getFilteredPosts(): Post[] {
    if (this.postFilter === 'all') return this.posts;
    if (this.postFilter === 'published') return this.posts.filter(p => p.isPublished);
    if (this.postFilter === 'draft') return this.posts.filter(p => !p.isPublished);
    return this.posts.filter(p => p.category === this.postFilter);
  }

  // =============== EVENTS ===============
  loadEvents(): void {
    this.apiService.getEvents().subscribe({
      next: (data) => {
        this.events = data.map((e: any) => ({
          ...e,
          eventType: e.eventType || e.type || 'event',
          date: e.date ? e.date.split('T')[0] : '',
          time: e.time || (e.date ? e.date.split('T')[1]?.substring(0, 5) : '')
        }));
        this.updateDashboardStats();
      },
      error: () => this.events = []
    });
  }

  openEventModal(event?: Event): void {
    this.editMode = !!event;
    this.eventForm = event ? { ...event } : { title: '', eventType: 'match', date: '', time: '', description: '', location: '' };
    this.showEventModal = true;
  }

  closeEventModal(): void {
    this.showEventModal = false;
    this.eventForm = { title: '', eventType: 'match', date: '', time: '', description: '', location: '' };
  }

  saveEvent(): void {
    if (!this.eventForm.title || !this.eventForm.date) {
      this.showToast('Veuillez remplir les champs obligatoires', 'error');
      return;
    }

    const eventData = {
      ...this.eventForm,
      date: `${this.eventForm.date}T${this.eventForm.time || '00:00'}:00`
    };

    if (this.editMode && this.eventForm.id) {
      this.apiService.updateEvent(this.eventForm.id, eventData).subscribe({
        next: () => {
          this.loadEvents();
          this.closeEventModal();
          this.showToast('Événement mis à jour', 'success');
        },
        error: () => this.showToast('Erreur lors de la mise à jour', 'error')
      });
    } else {
      this.apiService.createEvent(eventData).subscribe({
        next: () => {
          this.loadEvents();
          this.closeEventModal();
          this.showToast('Événement créé', 'success');
        },
        error: () => this.showToast('Erreur lors de la création', 'error')
      });
    }
  }

  deleteEvent(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;
    this.apiService.deleteEvent(id).subscribe({
      next: () => {
        this.loadEvents();
        this.showToast('Événement supprimé', 'warning');
      },
      error: () => this.showToast('Erreur lors de la suppression', 'error')
    });
  }

  // =============== MATCHES ===============
  loadMatches(): void {
    this.apiService.getMatches().subscribe({
      next: (data) => {
        this.matches = data.map((m: any) => ({
          ...m,
          date: m.date ? m.date.split('T')[0] : '',
          time: m.time || (m.date ? m.date.split('T')[1]?.substring(0, 5) : ''),
          hidden: m.hidden || false
        }));
        this.updateDashboardStats();
      },
      error: () => this.matches = []
    });
  }

  openMatchModal(match?: Match): void {
    this.editMode = !!match;
    this.matchForm = match ? { ...match } : { tournament: '', format: 'Bo1', team1: '', team2: '', date: '', time: '', hidden: false };
    this.showMatchModal = true;
  }

  closeMatchModal(): void {
    this.showMatchModal = false;
    this.matchForm = { tournament: '', format: 'Bo1', team1: '', team2: '', date: '', time: '', hidden: false };
  }

  saveMatch(): void {
    if (!this.matchForm.tournament || !this.matchForm.team1 || !this.matchForm.team2) {
      this.showToast('Veuillez remplir les champs obligatoires', 'error');
      return;
    }

    const matchData = {
      ...this.matchForm,
      date: `${this.matchForm.date || new Date().toISOString().split('T')[0]}T${this.matchForm.time || '00:00'}:00`
    };

    if (this.editMode && this.matchForm.id) {
      this.apiService.updateMatch(this.matchForm.id, matchData).subscribe({
        next: () => {
          this.loadMatches();
          this.closeMatchModal();
          this.showToast('Match mis à jour', 'success');
        },
        error: () => this.showToast('Erreur lors de la mise à jour', 'error')
      });
    } else {
      this.apiService.createMatch(matchData).subscribe({
        next: () => {
          this.loadMatches();
          this.closeMatchModal();
          this.showToast('Match créé', 'success');
        },
        error: () => this.showToast('Erreur lors de la création', 'error')
      });
    }
  }

  toggleMatchVisibility(match: Match): void {
    if (!match.id) return;
    this.apiService.toggleMatchVisibility(match.id).subscribe({
      next: (updated) => {
        match.hidden = updated.hidden;
        this.showToast(match.hidden ? 'Match masqué' : 'Match visible', 'success');
      },
      error: () => this.showToast('Erreur', 'error')
    });
  }

  toggleMatch(id: number): void {
    const match = this.matches.find(m => m.id === id);
    if (match) {
      this.toggleMatchVisibility(match);
    }
  }

  deleteMatch(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce match ?')) return;
    this.apiService.deleteMatch(id).subscribe({
      next: () => {
        this.loadMatches();
        this.showToast('Match supprimé', 'warning');
      },
      error: () => this.showToast('Erreur lors de la suppression', 'error')
    });
  }

  // =============== SCRIMS ===============
  loadScrims(): void {
    this.apiService.getScrims().subscribe({
      next: (data) => {
        this.scrims = data.map((s: any) => ({
          ...s,
          date: s.date ? s.date.split('T')[0] : '',
          status: s.status || 'PENDING'
        }));
        this.updateDashboardStats();
      },
      error: () => this.scrims = []
    });
  }

  updateScrimStatus(scrim: ScrimRequest, status: string): void {
    if (!scrim.id) return;
    const updated = { ...scrim, status: status.toUpperCase() };
    this.apiService.updateScrim(scrim.id, updated).subscribe({
      next: () => {
        scrim.status = status.toUpperCase();
        this.updateDashboardStats();
        this.showToast(`Demande ${status === 'APPROVED' ? 'acceptée' : 'refusée'}`, status === 'APPROVED' ? 'success' : 'warning');
      },
      error: () => this.showToast('Erreur', 'error')
    });
  }

  deleteScrim(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;
    this.apiService.deleteScrim(id).subscribe({
      next: () => {
        this.loadScrims();
        this.showToast('Demande supprimée', 'warning');
      },
      error: () => this.showToast('Erreur lors de la suppression', 'error')
    });
  }

  updateScrim(id: number, status: string): void {
    const scrim = this.scrims.find(s => s.id === id);
    if (scrim) {
      this.updateScrimStatus(scrim, status.toUpperCase());
    }
  }

  getFilteredScrims(): ScrimRequest[] {
    if (this.scrimFilter === 'all') return this.scrims;
    return this.scrims.filter(s => s.status === this.scrimFilter.toUpperCase());
  }

  // =============== SCHEDULE ===============
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
      },
      error: () => this.schedule = {}
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
        this.showToast('Planning mis à jour', 'success');
      },
      error: () => this.showToast('Erreur lors de la mise à jour', 'error')
    });
  }

  clearDay(day: string): void {
    if (!confirm('Êtes-vous sûr de vouloir effacer ce jour ?')) return;
    delete this.schedule[day];
    this.fillDay(day);
    this.showToast('Jour effacé', 'warning');
  }

  loadObjectives(): void {
    this.weeklyObjectives = localStorage.getItem('cgk_weekly_objectives') || '';
  }

  saveObjectives(): void {
    localStorage.setItem('cgk_weekly_objectives', this.weeklyObjectives);
    this.showToast('Objectifs enregistrés', 'success');
  }

  // =============== UI HELPERS ===============
  switchSection(section: string): void {
    this.activeSection = section;
    this.showMobileMenu = false;
    
    const nav = this.navSections.find(n => n.id === section);
    if (nav) this.activeCategory = nav.category;
    
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

  getSectionsByCategory(category: 'admin' | 'esport' | 'content'): NavSection[] {
    return this.navSections.filter(s => s.category === category);
  }

  getSectionTitle(): string {
    const titles: { [key: string]: string } = {
      dashboard: 'Tableau de bord',
      users: 'Gestion des Utilisateurs',
      products: 'Gestion des Produits',
      memberships: 'Gestion des Abonnements',
      posts: 'Gestion des Actualités',
      teams: 'Gestion des Équipes',
      events: 'Gestion des Événements',
      matches: 'Gestion des Matchs',
      scrims: 'Demandes de Scrims',
      schedule: 'Planning Hebdomadaire',
      settings: 'Paramètres'
    };
    return titles[this.activeSection] || 'Administration';
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  formatDate(date: string): string {
    if (!date) return 'Non défini';
    const d = new Date(`${date}T00:00:00`);
    if (Number.isNaN(d.getTime())) return 'Non défini';
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  }

  showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToastNotification = true;
    setTimeout(() => this.showToastNotification = false, 3000);
  }

  getRoleBadgeClass(role: string): string {
    const classes: { [key: string]: string } = {
      ADMIN: 'badge-admin',
      MODERATOR: 'badge-moderator',
      COACH: 'badge-coach',
      USER: 'badge-user'
    };
    return classes[role] || 'badge-user';
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      APPROVED: 'badge-success',
      PENDING: 'badge-warning',
      REJECTED: 'badge-danger'
    };
    return classes[status] || 'badge-warning';
  }

  badgeClass(status: string): string {
    return this.getStatusBadgeClass(status);
  }

  labelStatus(status: string): string {
    const map: { [key: string]: string } = {
      PENDING: 'En attente',
      APPROVED: 'Acceptée',
      REJECTED: 'Refusée'
    };
    return map[status] || status;
  }

  getGameIcon(game: string): string {
    const icons: { [key: string]: string } = {
      lol: '🎮',
      valorant: '🔫',
      cs2: '💥',
      fortnite: '🏗️'
    };
    return icons[game] || '🎮';
  }

  getEventTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      match: 'Match',
      scrim: 'Scrim',
      fanmeet: 'Fan Meet',
      event: 'Événement',
      training: 'Entraînement'
    };
    return labels[type] || type;
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      apparel: 'Vêtements',
      merchandise: 'Merchandise',
      bundle: 'Bundle',
      digital: 'Digital',
      esports: 'Esports',
      announcements: 'Annonces',
      interviews: 'Interviews',
      releases: 'Sorties',
      community: 'Communauté'
    };
    return labels[category] || category;
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

  // =============== STATS HELPERS (for template) ===============
  getActiveUsersCount(): number {
    return this.users.filter(u => u.isActive).length;
  }

  getAdminUsersCount(): number {
    return this.users.filter(u => u.role === 'ADMIN').length;
  }

  getInactiveUsersCount(): number {
    return this.users.filter(u => !u.isActive).length;
  }

  getInStockProductsCount(): number {
    return this.products.filter(p => p.stock > 0).length;
  }

  getFeaturedProductsCount(): number {
    return this.products.filter(p => p.isFeatured).length;
  }

  getLowStockProductsCount(): number {
    return this.products.filter(p => p.stock < 10).length;
  }

  getActiveMembershipsCount(): number {
    return this.memberships.filter(m => m.isActive).length;
  }

  getTotalMembershipsRevenue(): number {
    return this.memberships.reduce((sum, m) => sum + m.price, 0);
  }

  getPublishedPostsCount(): number {
    return this.posts.filter(p => p.isPublished).length;
  }

  getDraftPostsCount(): number {
    return this.posts.filter(p => !p.isPublished).length;
  }

  getTotalPostViews(): number {
    return this.posts.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  }

  getLolTeamsCount(): number {
    return this.teams.filter(t => t.game === 'lol').length;
  }

  getValorantTeamsCount(): number {
    return this.teams.filter(t => t.game === 'valorant').length;
  }

  getTotalTeamMembers(): number {
    return this.teams.reduce((sum, t) => sum + (t.members?.length || 0), 0);
  }

  getMatchEventsCount(): number {
    return this.events.filter(e => e.eventType === 'match').length;
  }

  getTrainingEventsCount(): number {
    return this.events.filter(e => e.eventType === 'training').length;
  }

  getVisibleMatchesCount(): number {
    return this.matches.filter(m => !m.hidden).length;
  }

  getHiddenMatchesCount(): number {
    return this.matches.filter(m => m.hidden).length;
  }

  getPendingScrimsCount(): number {
    return this.scrims.filter(s => s.status === 'pending' || s.status === 'PENDING').length;
  }

  getAcceptedScrimsCount(): number {
    return this.scrims.filter(s => s.status === 'accepted' || s.status === 'ACCEPTED' || s.status === 'APPROVED').length;
  }

  getRejectedScrimsCount(): number {
    return this.scrims.filter(s => s.status === 'rejected' || s.status === 'REJECTED').length;
  }
}

import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit, AfterViewInit {
  teams: any[] = [];
  filteredTeams: any[] = [];
  selectedFilter = 'all';
  games = ['all', 'lol', 'valorant', 'rocket-league', 'fortnite'];
  
  // Stats animées
  displayedStats = {
    teams: 0,
    players: 0,
    titles: 0,
    staff: 0
  };

  // Palmarès
  achievements = [
    { title: 'LEC Championship 2024', icon: '🏆', category: 'League of Legends' },
    { title: 'VCT Masters Tokyo', icon: '🏆', category: 'Valorant' },
    { title: 'RLCS World Championship', icon: '🏆', category: 'Rocket League' },
    { title: 'Regional Finals 2024', icon: '🥇', category: 'Multi-Games' }
  ];

  distinctions = [
    { title: 'Team of the Year 2024', icon: '⭐' },
    { title: 'Community Favorite', icon: '❤️' },
    { title: 'Rising Stars Award', icon: '🌟' },
    { title: 'Best Organization', icon: '🎖️' }
  ];

  constructor(private apiService: ApiService, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
    this.animateStats();
  }

  loadTeams(): void {
    this.apiService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        this.applyFilter('all');
      },
      error: (err) => console.error('Erreur teams:', err)
    });
  }

  applyFilter(game: string): void {
    this.selectedFilter = game;
    if (game === 'all') {
      this.filteredTeams = this.teams;
    } else {
      this.filteredTeams = this.teams.filter(t => t.game === game);
    }
  }

  getGameBadgeClass(game: string): string {
    const badges: { [key: string]: string } = {
      'lol': 'badge-lol',
      'valorant': 'badge-valorant',
      'rocket-league': 'badge-rl',
      'fortnite': 'badge-fortnite'
    };
    return badges[game?.toLowerCase()] || 'badge-default';
  }

  getGameIcon(game: string): string {
    const icons: { [key: string]: string } = {
      'lol': '⚔️',
      'valorant': '🎯',
      'rocket-league': '🚀',
      'fortnite': '🏗️'
    };
    return icons[game?.toLowerCase()] || '🎮';
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

  private animateStats(): void {
    const targets = { teams: this.filteredTeams.length || 6, players: 30, titles: 15, staff: 18 };
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.displayedStats = {
        teams: Math.round(targets.teams * eased),
        players: Math.round(targets.players * eased),
        titles: Math.round(targets.titles * eased),
        staff: Math.round(targets.staff * eased)
      };

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}
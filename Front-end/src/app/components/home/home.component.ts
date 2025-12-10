import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  teams: any[] = [];
  products: any[] = [];
  memberships: any[] = [];
  posts: any[] = [];
  events: any[] = [];
  
  // Animation states
  heroVisible = false;
  statsVisible = false;
  
  // Stats counters
  displayedStats = {
    teams: 0,
    events: 0,
    products: 0,
    members: 0
  };
  
  // Parallax
  parallaxOffset = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
    setTimeout(() => this.heroVisible = true, 100);
  }

  ngAfterViewInit(): void {
    this.initAnimations();
    this.initIntersectionObserver();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.parallaxOffset = window.scrollY * 0.3;
  }

  loadData(): void {
    this.apiService.getTeams().subscribe({
      next: (data) => {
        this.teams = data.slice(0, 4);
        this.animateCounter('teams', data.length);
      },
      error: (err) => console.error('Erreur teams:', err)
    });

    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.products = data.slice(0, 4);
        this.animateCounter('products', data.length);
      },
      error: (err) => console.error('Erreur products:', err)
    });

    this.apiService.getMemberships().subscribe({
      next: (data) => {
        this.memberships = data.slice(0, 3);
        this.animateCounter('members', 1500); // Placeholder member count
      },
      error: (err) => console.error('Erreur memberships:', err)
    });

    this.apiService.getPosts().subscribe({
      next: (data) => this.posts = data.slice(0, 3),
      error: (err) => console.error('Erreur posts:', err)
    });

    this.apiService.getEvents().subscribe({
      next: (data) => {
        this.events = data.slice(0, 3);
        this.animateCounter('events', data.length);
      },
      error: (err) => console.error('Erreur events:', err)
    });
  }

  private initAnimations(): void {
    import('gsap').then(({ gsap }) => {
      // Hero text animation
      gsap.fromTo('.hero-title-line',
        { opacity: 0, y: 60, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
      );
      
      gsap.fromTo('.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.8 }
      );
      
      gsap.fromTo('.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 1.2 }
      );
      
      // Floating elements
      gsap.to('.float-element', {
        y: -15,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.3
      });
    }).catch(() => console.log('GSAP fallback'));
  }

  private initIntersectionObserver(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          if (entry.target.classList.contains('stats-section')) {
            this.statsVisible = true;
          }
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }

  private animateCounter(key: keyof typeof this.displayedStats, target: number): void {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      this.displayedStats[key] = Math.floor(start + (target - start) * easeOutQuart);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    setTimeout(() => requestAnimationFrame(animate), 500);
  }

  getTeamBadgeClass(game: string): string {
    const classes: { [key: string]: string } = {
      'league of legends': 'badge-lol',
      'valorant': 'badge-valorant',
      'rocket league': 'badge-rl',
      'fortnite': 'badge-fortnite'
    };
    return classes[game?.toLowerCase()] || 'badge-default';
  }
}
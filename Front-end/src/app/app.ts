import { Component, OnInit, AfterViewInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  title = 'D-PRESSION';
  
  // Navigation state
  isMenuOpen = false;
  isScrolled = false;
  currentRoute = '/home';
  
  // Navigation items
  navItems = [
    { path: '/home', label: 'Accueil', icon: 'home' },
    { path: '/teams', label: 'Équipes', icon: 'users' },
    { path: '/schedule', label: 'Calendrier', icon: 'calendar' },
    { path: '/news', label: 'Actualités', icon: 'newspaper' },
    { path: '/shop', label: 'Boutique', icon: 'shopping-bag' },
    { path: '/membership', label: 'Membership', icon: 'star' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
      this.isMenuOpen = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  ngAfterViewInit(): void {
    // Initialize GSAP animations if available
    this.initAnimations();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  private initAnimations(): void {
    // Dynamic import of GSAP for animations
    import('gsap').then(({ gsap }) => {
      gsap.fromTo('.nav-logo', 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
      );
      
      gsap.fromTo('.nav-item-animated', 
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
      );
    }).catch(() => {
      // GSAP not available, use CSS fallbacks
      console.log('GSAP not loaded, using CSS animations');
    });
  }

  getNavItemClass(path: string): string {
    const isActive = this.currentRoute === path || 
                     (path === '/home' && this.currentRoute === '/');
    return isActive ? 'nav-link nav-link-active' : 'nav-link';
  }
}
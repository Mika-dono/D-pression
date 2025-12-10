import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit, AfterViewInit {
  memberships: any[] = [];
  selectedPlan: string | null = null;
  
  // Default plans if API returns empty
  defaultPlans = [
    {
      id: 'free',
      name: 'Fan',
      price: 0,
      period: 'Gratuit',
      description: 'Accès basique à la communauté',
      benefits: [
        'Accès au Discord public',
        'Newsletter mensuelle',
        'Wallpapers exclusifs',
        'Badge membre'
      ],
      popular: false,
      icon: '🎮'
    },
    {
      id: 'supporter',
      name: 'Supporter',
      price: 4.99,
      period: '/mois',
      description: 'Soutenez l\'équipe au quotidien',
      benefits: [
        'Tous les avantages Fan',
        'Discord privé supporters',
        'Émotes exclusives',
        'Vote dans les sondages',
        '-10% boutique'
      ],
      popular: false,
      icon: '⭐'
    },
    {
      id: 'elite',
      name: 'Élite',
      price: 9.99,
      period: '/mois',
      description: 'L\'expérience premium ultime',
      benefits: [
        'Tous les avantages Supporter',
        'Q&A mensuels avec les joueurs',
        'Contenus behind-the-scenes',
        'Badge animé Discord',
        '-20% boutique',
        'Accès early aux drops'
      ],
      popular: true,
      icon: '👑'
    },
    {
      id: 'legend',
      name: 'Légende',
      price: 24.99,
      period: '/mois',
      description: 'Le cercle des légendes D-PRESSION',
      benefits: [
        'Tous les avantages Élite',
        'Meet & Greet annuel',
        'Merchandise exclusif',
        'Nom dans les crédits',
        '-30% boutique',
        'Support prioritaire',
        'Invitations events VIP'
      ],
      popular: false,
      icon: '🏆'
    }
  ];

  // Stats
  communityStats = {
    members: 50000,
    supporters: 12000,
    discordMembers: 35000,
    countries: 45
  };

  // Testimonials
  testimonials = [
    {
      name: 'Alex_Pro',
      plan: 'Élite',
      avatar: '👤',
      text: 'Le meilleur investissement pour un vrai fan. Les Q&A avec les joueurs sont incroyables!'
    },
    {
      name: 'ShadowGamer',
      plan: 'Légende',
      avatar: '👤',
      text: 'Le Meet & Greet a été une expérience inoubliable. La communauté est géniale.'
    },
    {
      name: 'NightOwl',
      plan: 'Supporter',
      avatar: '👤',
      text: 'Discord privé au top, émotes exclusives et réductions boutique. Je recommande!'
    }
  ];

  constructor(private apiService: ApiService, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.loadMemberships();
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
    this.animateCounters();
  }

  loadMemberships(): void {
    this.apiService.getMemberships().subscribe({
      next: (data) => {
        this.memberships = data.length > 0 ? data : this.defaultPlans;
      },
      error: (err) => {
        console.error('Erreur memberships:', err);
        this.memberships = this.defaultPlans;
      }
    });
  }

  selectPlan(planId: string): void {
    this.selectedPlan = planId;
  }

  subscribeTo(membership: any): void {
    console.log('Subscription to:', membership.name);
    // Implement subscription logic - could open modal or redirect
  }

  formatPrice(price: number): string {
    if (price === 0) return 'Gratuit';
    return price.toFixed(2) + '€';
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

  private animateCounters(): void {
    // Animation des stats - simplified
  }
}
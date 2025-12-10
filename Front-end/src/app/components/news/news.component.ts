import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, AfterViewInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  selectedCategory = 'all';
  categories = ['all', 'esports', 'community', 'shop', 'events'];
  
  featuredPost: any = null;

  constructor(private apiService: ApiService, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
  }

  loadPosts(): void {
    this.apiService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        if (this.posts.length > 0) {
          this.featuredPost = this.posts[0];
          this.filteredPosts = this.posts.slice(1);
        }
      },
      error: (err) => console.error('Erreur posts:', err)
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredPosts = this.posts.slice(1);
    } else {
      this.filteredPosts = this.posts.slice(1).filter(p => 
        p.category?.toLowerCase() === category.toLowerCase()
      );
    }
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatRelativeDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
    return this.formatDate(date);
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'esports': '🎮',
      'community': '👥',
      'shop': '🛍️',
      'events': '📅',
      'news': '📰'
    };
    return icons[category?.toLowerCase()] || '📰';
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
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  posts: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.apiService.getPosts().subscribe({
      next: (data) => this.posts = data,
      error: (err) => console.error('Erreur posts:', err)
    });
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
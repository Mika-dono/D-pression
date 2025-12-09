import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  teams: any[] = [];
  products: any[] = [];
  memberships: any[] = [];
  posts: any[] = [];
  events: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.apiService.getTeams().subscribe({
      next: (data) => this.teams = data.slice(0, 2),
      error: (err) => console.error('Erreur teams:', err)
    });

    this.apiService.getProducts().subscribe({
      next: (data) => this.products = data.slice(0, 3),
      error: (err) => console.error('Erreur products:', err)
    });

    this.apiService.getMemberships().subscribe({
      next: (data) => this.memberships = data.slice(0, 4),
      error: (err) => console.error('Erreur memberships:', err)
    });

    this.apiService.getPosts().subscribe({
      next: (data) => this.posts = data.slice(0, 3),
      error: (err) => console.error('Erreur posts:', err)
    });

    this.apiService.getEvents().subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error('Erreur events:', err)
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  teams: any[] = [];
  filteredTeams: any[] = [];
  selectedFilter = 'all';
  games = ['all', 'lol', 'valorant', 'academy'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTeams();
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

  setupTabs(): void {
    // Tab switching logic for player details
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {
  memberships: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadMemberships();
  }

  loadMemberships(): void {
    this.apiService.getMemberships().subscribe({
      next: (data) => this.memberships = data,
      error: (err) => console.error('Erreur memberships:', err)
    });
  }

  subscribeTo(membership: any): void {
    console.log('Subscription to:', membership.name);
    // Implement subscription logic
  }
}

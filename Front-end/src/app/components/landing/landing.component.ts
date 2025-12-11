import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  features = [
    { icon: '🎮', title: 'Équipes Professionnelles', desc: 'Suivez nos rosters LoL, Valorant et CS2' },
    { icon: '🛒', title: 'Boutique Exclusive', desc: 'Merchandise officiel et éditions limitées' },
    { icon: '📅', title: 'Calendrier & Events', desc: 'Ne manquez aucun match ou événement' },
    { icon: '👑', title: 'Membership VIP', desc: 'Avantages exclusifs pour les vrais fans' }
  ];

  stats = [
    { value: '4', label: 'Équipes Pro' },
    { value: '72%', label: 'Winrate LoL' },
    { value: '50K+', label: 'Fans' },
    { value: '15+', label: 'Trophées' }
  ];
}

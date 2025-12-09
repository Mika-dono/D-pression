import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { MembershipComponent } from './components/membership/membership.component';
import { NewsComponent } from './components/news/news.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ShopComponent } from './components/shop/shop.component';
import { TeamsComponent } from './components/teams/teams.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'membership', component: MembershipComponent },
  { path: 'news', component: NewsComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'teams', component: TeamsComponent },

  { path: 'admin', component: AdminComponent },

  { path: '**', redirectTo: 'home' }
];

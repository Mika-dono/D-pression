# KJX - Guide d'Intégration Frontend-Backend

## 🚀 État du Projet

### Frontend (Angular 21)
- ✅ 7 composants avec HTML complet
- ✅ Routing configuré
- ✅ ApiService prêt (http://localhost:8080/api)
- ✅ HttpClientModule importé
- ✅ Intercepteurs CORS déjà configurés

### Backend (Spring Boot 4.0)
- ✅ 6 Services métier
- ✅ 6 REST Controllers avec @CrossOrigin
- ✅ 7 Repositories avec requêtes personnalisées
- ✅ 8 Entities JPA
- ✅ Flyway migrations SQL Server
- ✅ SQL Server configuré (MICHAEL:1433 / Ultimate_db)

## 📡 Flux de Communication

```
Angular Component
       ↓
ApiService (http://localhost:8080/api)
       ↓
Spring Boot REST Controller
       ↓
Service Layer (Logique métier)
       ↓
Repository (Spring Data JPA)
       ↓
SQL Server (Ultimate_db)
```

## 🔗 Endpoints Disponibles

### Teams
```
GET    /api/teams              → getAllTeams()
POST   /api/teams              → createTeam(team)
GET    /api/teams/{id}         → getTeamById(id)
PUT    /api/teams/{id}         → updateTeam(id, team)
DELETE /api/teams/{id}         → deleteTeam(id)
GET    /api/teams/game/{game}  → getTeamsByGame(game)
```

### Events
```
GET    /api/events             → getAllEvents()
GET    /api/events/{id}        → getEventById(id)
POST   /api/events             → createEvent(event)
PUT    /api/events/{id}        → updateEvent(id, event)
DELETE /api/events/{id}        → deleteEvent(id)
GET    /api/events/type/{type} → getEventsByType(type)
GET    /api/events/upcoming    → getUpcomingEvents()
GET    /api/events/team/{teamId} → getEventsByTeamId(teamId)
```

### Products
```
GET    /api/products           → getAllProducts()
GET    /api/products/{id}      → getProductById(id)
POST   /api/products           → createProduct(product)
PUT    /api/products/{id}      → updateProduct(id, product)
DELETE /api/products/{id}      → deleteProduct(id)
GET    /api/products/category/{cat} → getProductsByCategory(cat)
GET    /api/products/featured  → getFeaturedProducts()
```

### Posts
```
GET    /api/posts              → getAllPosts()
GET    /api/posts/{id}         → getPostById(id)
POST   /api/posts              → createPost(post)
PUT    /api/posts/{id}         → updatePost(id, post)
DELETE /api/posts/{id}         → deletePost(id)
GET    /api/posts/category/{cat} → getPostsByCategory(cat)
GET    /api/posts/published    → getPublishedPosts()
```

### Memberships
```
GET    /api/memberships        → getAllMemberships()
GET    /api/memberships/{id}   → getMembershipById(id)
POST   /api/memberships        → createMembership(membership)
PUT    /api/memberships/{id}   → updateMembership(id, membership)
DELETE /api/memberships/{id}   → deleteMembership(id)
GET    /api/memberships/active → getActiveMemberships()
```

### Scrims
```
GET    /api/scrims             → getAllScrims()
GET    /api/scrims/{id}        → getScrimById(id)
POST   /api/scrims             → createScrim(scrim)
PUT    /api/scrims/{id}        → updateScrim(id, scrim)
DELETE /api/scrims/{id}        → deleteScrim(id)
GET    /api/scrims/status/{status} → getScrimsByStatus(status)
GET    /api/scrims/team/{teamId}   → getScrimsByTeamId(teamId)
```

## 🛠️ Exemples d'Utilisation

### Dans un Composant Angular

#### 1. Charger les équipes
```typescript
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html'
})
export class TeamsComponent implements OnInit {
  teams: any[] = [];
  
  constructor(private apiService: ApiService) {}
  
  ngOnInit() {
    this.apiService.getTeams().subscribe(
      (data) => {
        this.teams = data;
      },
      (error) => console.error('Erreur:', error)
    );
  }
}
```

#### 2. Créer une équipe
```typescript
createTeam() {
  const newTeam = {
    name: 'KJX Red',
    game: 'lol',
    description: 'Roster principal',
    logoUrl: 'https://...',
    winRate: 0.65
  };
  
  this.apiService.createTeam(newTeam).subscribe(
    (team) => console.log('Équipe créée:', team),
    (error) => console.error('Erreur:', error)
  );
}
```

#### 3. Mettre à jour un événement
```typescript
updateEvent(eventId: number, updates: any) {
  this.apiService.updateEvent(eventId, updates).subscribe(
    (event) => {
      console.log('Événement mis à jour:', event);
      this.refreshEvents();
    },
    (error) => console.error('Erreur:', error)
  );
}
```

#### 4. Supprimer un produit
```typescript
deleteProduct(productId: number) {
  this.apiService.deleteProduct(productId).subscribe(
    () => {
      console.log('Produit supprimé');
      this.refreshProducts();
    },
    (error) => console.error('Erreur:', error)
  );
}
```

### Template HTML

```html
<!-- Afficher les équipes -->
<div *ngFor="let team of teams">
  <h3>{{ team.name }}</h3>
  <p>{{ team.game }} - Victoires: {{ team.winRate * 100 }}%</p>
</div>

<!-- Formulaire de création -->
<form (ngSubmit)="createTeam()" [(ngModel)]="newTeam">
  <input [(ngModel)]="newTeam.name" placeholder="Nom de l'équipe">
  <input [(ngModel)]="newTeam.game" placeholder="Jeu">
  <button type="submit">Créer</button>
</form>

<!-- Afficher les événements à venir -->
<div *ngFor="let event of upcomingEvents">
  <h4>{{ event.title }}</h4>
  <p>{{ event.date | date:'short' }} - {{ event.location }}</p>
  <p>vs {{ event.opponent }}</p>
</div>
```

## 🚀 Démarrage de l'Application

### 1. Démarrer SQL Server
S'assurer que SQL Server est running sur MICHAEL:1433

### 2. Démarrer le Backend
```bash
cd d:\REPO\D-pression\Back-end
mvn spring-boot:run
```

Vérifier que l'application démarre sans erreur et que Flyway crée les tables.

### 3. Démarrer le Frontend
```bash
cd d:\REPO\D-pression\Front-end
npm start
# ou
ng serve
```

### 4. Tester la Connexion
- Ouvrir http://localhost:4200
- Ouvrir la console du navigateur (F12)
- Naviguer vers une page qui charge les données
- Vérifier dans Network que les requêtes arrivent à localhost:8080/api

## ✅ Checklist d'Intégration

- [ ] SQL Server running sur MICHAEL:1433
- [ ] Backend Spring Boot démarré sur port 8080
- [ ] Frontend Angular démarré sur port 4200
- [ ] ApiService pointe vers http://localhost:8080/api
- [ ] CORS configuré (accepte localhost:4200)
- [ ] Composants appellent ApiService (home, admin, teams, etc.)
- [ ] Pas d'erreurs CORS dans la console
- [ ] Données s'affichent correctement
- [ ] Formulaires POST/PUT/DELETE marchent
- [ ] Responsive design fonctionne

## 📊 Modèles de Données

### Team
```json
{
  "id": 1,
  "name": "KJX Red",
  "game": "lol",
  "description": "...",
  "logoUrl": "https://...",
  "winRate": 0.65,
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00",
  "members": []
}
```

### Event
```json
{
  "id": 1,
  "title": "LEC Match",
  "description": "...",
  "type": "match",
  "date": "2024-01-15T18:00:00",
  "time": "18:00",
  "location": "Online",
  "status": "SCHEDULED",
  "opponent": "Fnatic",
  "teamId": 1,
  "createdAt": "2024-01-01T00:00:00"
}
```

### Product
```json
{
  "id": 1,
  "name": "Jersey KJX",
  "description": "...",
  "category": "apparel",
  "price": 49.99,
  "stock": 15,
  "imageUrl": "https://...",
  "featured": true,
  "createdAt": "2024-01-01T00:00:00"
}
```

## 🔐 Authentification (À faire)

À implémenter pour sécuriser les endpoints admin:
- JWT tokens
- Spring Security
- Session management
- Login form
- Hasher les mots de passe

## 📝 Notes

- Tous les timestamps sont automatiques (created_at, updated_at)
- Cascade delete configuré pour maintenir l'intégrité
- 40+ indexes SQL Server pour performance
- Audit logging disponible
- CORS ouvert pour développement (à restreindre en production)

## 🆘 Dépannage

### "Cannot connect to localhost:8080"
- Vérifier que Spring Boot est démarré
- Vérifier le port dans application.properties
- Vérifier les firewalls

### "CORS error"
- S'assurer que @CrossOrigin(origins = "*") est sur les Controllers
- Vérifier que le frontend accède à localhost:8080/api

### "No data displayed"
- Ouvrir Network tab (F12)
- Vérifier que les requêtes retournent 200
- Vérifier que les données sont dans la réponse JSON

### "SQL Server connection refused"
- Ping MICHAEL
- Vérifier que SQL Server écoute sur 1433
- Vérifier les credentials mika/mikado
- Vérifier que Ultimate_db existe

---

**Backend**: http://localhost:8080/api
**Frontend**: http://localhost:4200
**Database**: MICHAEL:1433 / Ultimate_db

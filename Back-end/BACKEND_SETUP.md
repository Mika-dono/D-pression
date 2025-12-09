# KJX Esports Backend - Spring Boot Configuration

## Configuration SQL Server

### Serveur de Base de Données
- **Serveur**: MICHAEL
- **Port**: 1433
- **Base de données**: Ultimate_db
- **Utilisateur**: mika
- **Mot de passe**: mikado
- **Certificat SSL**: Accepté (trustServerCertificate=true)

### Fichier de Configuration
Voir `src/main/resources/application.properties` pour les détails complets.

## Architecture Backend

### Couches d'Application

#### 1. Entities (JPA)
- `Team` - Équipes esports
- `TeamMember` - Joueurs et staff
- `Event` - Événements (matches, scrims, fanmeets)
- `Product` - Produits boutique
- `Membership` - Abonnements
- `Post` - Articles/News
- `Scrim` - Demandes de scrim
- `User` - Comptes utilisateurs
- `Schedule` - Calendrier d'équipe

#### 2. Repositories (Spring Data JPA)
Interface CRUD pour chaque Entity avec requêtes personnalisées:
- `TeamRepository.findByGame(game)`
- `EventRepository.findByType(), findByDateAfter(), findByTeamId()`
- `ProductRepository.findByCategory(), findByFeaturedTrue()`
- `PostRepository.findByCategory(), findByIsPublishedTrue()`
- `ScrimRepository.findByStatus(), findByTeamId()`
- `MembershipRepository.findByIsActiveTrue()`
- `UserRepository.findByUsername(), findByEmail()`

#### 3. Services
Logique métier pour:
- TeamService
- EventService
- ProductService
- PostService
- MembershipService
- ScrimService

#### 4. Controllers (REST API)
API endpoints disponibles:

```
GET    /api/teams              - Lister toutes les équipes
POST   /api/teams              - Créer une équipe
GET    /api/teams/{id}         - Récupérer une équipe
PUT    /api/teams/{id}         - Modifier une équipe
DELETE /api/teams/{id}         - Supprimer une équipe
GET    /api/teams/game/{game}  - Équipes par jeu

GET    /api/events             - Tous les événements
GET    /api/events/upcoming    - Événements à venir
GET    /api/events/type/{type} - Événements par type
GET    /api/events/team/{teamId} - Événements d'une équipe

GET    /api/products           - Tous les produits
GET    /api/products/featured  - Produits à la une
GET    /api/products/category/{category} - Produits par catégorie

GET    /api/posts              - Tous les articles
GET    /api/posts/published    - Articles publiés
GET    /api/posts/category/{category} - Articles par catégorie

GET    /api/memberships        - Tous les abonnements
GET    /api/memberships/active - Abonnements actifs

GET    /api/scrims             - Toutes les demandes
GET    /api/scrims/status/{status} - Scrims par statut
GET    /api/scrims/team/{teamId} - Scrims d'une équipe
```

## Déploiement & Migrations

### Flyway Migrations
Les migrations SQL Server sont automatiquement exécutées au démarrage:
- `V1__Initial_Schema.sql` - Création des tables
- `V2__Seed_Initial_Data.sql` - Données initiales

### Base de Données
**Tables créées**:
- teams (10 indexes)
- team_members
- events
- products
- memberships
- posts
- scrims
- schedules
- users
- audit_log

**Capacités**:
- Cascade delete pour maintenir l'intégrité
- Timestamps automatiques (created_at, updated_at)
- Audit logging
- Soft delete capable

## Démarrage de l'Application

### Via Maven
```bash
cd d:\REPO\D-pression\Back-end
mvn spring-boot:run
```

### Application s'ouvre sur
- **Base URL**: http://localhost:8080
- **API Context**: http://localhost:8080/api
- **Fichier de log**: target/logs/spring-boot.log

## Tests de Connexion

### Via PowerShell
```powershell
# Tester la connexion directe
Invoke-WebRequest -Uri "http://localhost:8080/api/teams" -Method GET

# Créer une équipe
$body = @{
    name = "KJX Red"
    game = "lol"
    description = "Roster principal League of Legends"
    logoUrl = "https://..."
    winRate = 0.65
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/teams" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

## Intégration Frontend

### ApiService Configuration
Mettre à jour `front-end/src/app/services/api.service.ts`:
```typescript
private apiUrl = 'http://localhost:8080/api';
```

### Appels HTTP disponibles
- `GET /api/teams` → Observable<Team[]>
- `GET /api/events` → Observable<Event[]>
- `GET /api/products` → Observable<Product[]>
- etc.

## Authentification

À implémenter:
- JWT tokens ou Spring Security
- Protéger les endpoints admin
- Hasher les mots de passe utilisateur

## Performance

### Configuration Hibernate
- Batch size: 20 inserts/updates
- Format SQL: Enabled pour debugging
- Order inserts/updates: Optimisé

### Indexes SQL Server
40+ indexes sur colonnes critiques pour accélération des requêtes:
- game, name (teams)
- date, type, category (events, posts)
- featured, category (products)
- status (scrims)
- username, email (users)

## Support & Dépannage

### Port Already in Use
```powershell
# Trouver le processus sur le port 8080
Get-NetTCPConnection -LocalPort 8080

# Ou changer le port dans application.properties
server.port=8081
```

### Erreurs de Connexion SQL Server
- Vérifier que MICHAEL:1433 est accessible
- Vérifier credentials mika/mikado
- Vérifier que la base Ultimate_db existe
- Vérifier trustServerCertificate=true

### Logs
```powershell
# Voir les logs détaillés
mvn spring-boot:run -Dlogging.level.root=DEBUG
```

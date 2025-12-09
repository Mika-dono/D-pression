# 🧪 Guide de Test Complet - KJX Application

## Phase 1 : Tests Backend Unitaires

### 1. Vérifier la Compilation Maven
```powershell
cd d:\REPO\D-pression\Back-end
mvn clean compile -DskipTests
```
**Résultat attendu**: `[INFO] BUILD SUCCESS`

### 2. Vérifier la Configuration SQL Server
```powershell
# Tester la connexion DirectSQL Server
sqlcmd -S MICHAEL -U mika -P mikado -d Ultimate_db -Q "SELECT COUNT(*) as TableCount FROM INFORMATION_SCHEMA.TABLES"
```
**Résultat attendu**: Nombre de tables dans la base

### 3. Vérifier les Dépendances
```powershell
mvn dependency:tree | grep -E "mssql-jdbc|flyway|lombok|spring-boot"
```
**Résultat attendu**: Toutes les dépendances listées

## Phase 2 : Tests d'Intégration Backend

### 1. Démarrer Spring Boot
```powershell
cd d:\REPO\D-pression\Back-end
mvn spring-boot:run
```

**Logs à vérifier**:
```
[INFO] Started KjxApplication in X.XXX seconds
[INFO] Flyway: Successfully validated 2 migrations
[INFO] Flyway: Successfully applied 1 migration
[INFO] Tomcat started on port 8080
```

### 2. Vérifier la Création des Tables (Flyway)
```powershell
# Après le démarrage, vérifier les tables créées
sqlcmd -S MICHAEL -U mika -P mikado -d Ultimate_db -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='dbo' ORDER BY TABLE_NAME"
```

**Tables attendues**:
- audit_log
- events
- memberships
- posts
- products
- schedules
- scrims
- team_members
- teams
- users

### 3. Tester les Endpoints REST

#### Test 1 : Récupérer les équipes (vide initialement)
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/teams" -Method GET
Write-Host $response.StatusCode
Write-Host $response.Content
```

**Résultat attendu**: 
- Status: 200
- Body: [] ou liste vide

#### Test 2 : Créer une équipe
```powershell
$team = @{
    name = "KJX Red"
    game = "lol"
    description = "Roster principal League of Legends"
    logoUrl = "https://kjx-esports.com/logo-red.png"
    winRate = 0.65
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/teams" `
    -Method POST `
    -Body $team `
    -ContentType "application/json" `
    -Headers @{"Accept"="application/json"}

Write-Host "Status:" $response.StatusCode
Write-Host "Response:" $response.Content
```

**Résultat attendu**:
- Status: 200
- Body contient l'équipe créée avec un id

#### Test 3 : Créer un produit
```powershell
$product = @{
    name = "Jersey KJX"
    description = "Jersey officiel KJX"
    category = "apparel"
    price = 49.99
    stock = 20
    imageUrl = "https://..."
    featured = $true
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/products" `
    -Method POST `
    -Body $product `
    -ContentType "application/json"

Write-Host "Status:" $response.StatusCode
```

#### Test 4 : Créer un événement
```powershell
$event = @{
    title = "LEC Match vs Fnatic"
    description = "Match regular season"
    type = "match"
    date = "2024-01-20T18:00:00"
    time = "18:00"
    location = "Online"
    status = "SCHEDULED"
    opponent = "Fnatic"
    teamId = 1
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/events" `
    -Method POST `
    -Body $event `
    -ContentType "application/json"

Write-Host "Status:" $response.StatusCode
```

#### Test 5 : Récupérer les produits par catégorie
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/products/category/apparel" -Method GET
Write-Host $response.Content
```

#### Test 6 : Récupérer les événements à venir
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/events/upcoming" -Method GET
Write-Host $response.Content
```

## Phase 3 : Tests Frontend

### 1. Démarrer Angular
```powershell
cd d:\REPO\D-pression\Front-end
npm start
# ou
ng serve
```

**Résultat attendu**:
- http://localhost:4200 accessible
- Pas d'erreurs TypeScript

### 2. Tester la Page d'Accueil
1. Ouvrir http://localhost:4200
2. Vérifier que la page charge
3. Ouvrir F12 → Network tab
4. Rafraîchir la page
5. Vérifier les requêtes à localhost:8080/api

**Requêtes attendues**:
- GET /api/teams
- GET /api/events
- GET /api/products
- GET /api/memberships
- GET /api/posts

### 3. Tester la Navigation
- Cliquer sur "Accueil" → vérifier que ça charge
- Cliquer sur "Équipes" → vérifier que ça charge
- Cliquer sur "Boutique" → vérifier que ça charge
- Cliquer sur "Actualités" → vérifier que ça charge
- Cliquer sur "Adhésions" → vérifier que ça charge

### 4. Tester le Composant Admin
1. Aller à http://localhost:4200/admin
2. Login avec admin/admin123
3. Vérifier que le dashboard charge
4. Cliquer sur "Scrims management"
5. Cliquer sur "Weekly planning"
6. Vérifier que les formulaires marchent

### 5. Tester la Réactivité
1. Ouvrir DevTools (F12)
2. Cliquer sur l'icône téléphone (responsive mode)
3. Tester sur mobile (375px), tablet (768px), desktop (1920px)
4. Vérifier que le layout s'adapte

## Phase 4 : Tests E2E Complètes

### Scénario 1 : Créer une équipe et ajouter un événement

**Étapes**:
1. Backend : Créer une équipe
```powershell
# POST /api/teams
$team = @{ name="KJX Academy"; game="lol"; ... } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8080/api/teams" -Method POST -Body $team
```

2. Backend : Créer un événement pour cette équipe
```powershell
# POST /api/events (avec teamId=1)
Invoke-WebRequest -Uri "http://localhost:8080/api/events" -Method POST -Body $event
```

3. Frontend : Vérifier que l'équipe apparaît sur la page accueil
4. Frontend : Vérifier que l'événement apparaît sur le calendrier

### Scénario 2 : Gestion de boutique

**Étapes**:
1. Backend : Créer 3 produits avec featured=true
2. Frontend : Vérifier qu'ils s'affichent sur la page d'accueil
3. Frontend : Naviguer vers /shop
4. Frontend : Vérifier qu'on peut filtrer par catégorie
5. Frontend : Vérifier qu'on peut ajouter au panier
6. Frontend : Vérifier le calcul du total

### Scénario 3 : Panel Admin

**Étapes**:
1. Frontend : Aller sur /admin
2. Frontend : Login admin/admin123
3. Backend : POST /api/scrims (status=PENDING)
4. Frontend : Rafraîchir le panel
5. Frontend : Vérifier que le scrim s'affiche en "Pending"
6. Frontend : Cliquer "Approve"
7. Backend : PUT /api/scrims/1 (status=APPROVED)
8. Frontend : Vérifier le statut change

## Phase 5 : Tests de Performance

### 1. Vérifier les Indexes SQL Server
```powershell
sqlcmd -S MICHAEL -U mika -P mikado -d Ultimate_db -Q "SELECT TABLE_NAME, INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA='dbo' ORDER BY TABLE_NAME"
```

**Résultat attendu**: 40+ indexes listés

### 2. Vérifier le Batch Hibernate
```powershell
# Voir dans les logs si Hibernate batch_size=20
grep "batch_size" d:\REPO\D-pression\Back-end\src\main\resources\application.properties
```

### 3. Tester la Pagination (À implémenter)
```powershell
# Ces endpoints accepteront page/size
GET /api/teams?page=0&size=10
GET /api/products?page=0&size=20
```

## Phase 6 : Validation Finale

### Checklist
- [ ] SQL Server accessible et Ultimate_db existe
- [ ] Backend démarre sans erreur (BUILD SUCCESS)
- [ ] Flyway crée les 10 tables correctement
- [ ] Tous les endpoints REST répondent (200 OK)
- [ ] CRUD operations marchent (POST, PUT, DELETE)
- [ ] Frontend démarre sur http://localhost:4200
- [ ] Toutes les pages chargent sans erreur
- [ ] Navigation entre pages fonctionne
- [ ] Data s'affiche depuis les API
- [ ] Formulaires marchent (create/update)
- [ ] Responsive design OK
- [ ] Pas de CORS errors
- [ ] Console browser clean (pas d'erreurs)
- [ ] Console VS Code clean (pas d'erreurs)

## 🎯 Résultats Attendus

### À la fin de tous les tests:
1. **Backend opérationnel** ✅
   - Spring Boot tourne sur 8080
   - SQL Server connecté à Ultimate_db
   - Flyway migrations appliquées
   - REST API disponible

2. **Frontend opérationnel** ✅
   - Angular tourne sur 4200
   - Tous les composants affichent du contenu
   - Navigation fluide
   - Formulaires fonctionnels

3. **Base de données** ✅
   - 10 tables créées avec indexes
   - Données persistantes
   - Relationships intacts
   - Queries rapides

## 🚨 Troubleshooting

### Backend ne démarre pas
```
→ Vérifier: pom.xml, Java 17, SQL Server running
→ Logs: mvn spring-boot:run
```

### Frontend ne charge pas
```
→ Vérifier: npm install, port 4200 libre
→ Logs: ng serve
```

### API renvoie 404
```
→ Vérifier: endpoint existe, @RequestMapping correct
→ Backend logit les requêtes?
```

### Pas de données
```
→ Vérifier: Flyway migrations exécutées?
→ Vérifier: Seed data V2__Seed_Initial_Data.sql
→ Vérifier: Table existe dans Ultimate_db?
```

### CORS error
```
→ Ajouter @CrossOrigin(origins = "*") sur le Controller
→ Vérifier: Frontend accède à localhost:8080/api
```

---

**Status**: ✅ Ready for Testing
**Date**: 2024-01-09
**Version**: 1.0.0

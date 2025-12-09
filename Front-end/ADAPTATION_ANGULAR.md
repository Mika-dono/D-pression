# Front-end Angular - KJX Esports

## 📋 Résumé des modifications

Le dossier Front-end a été **complètement restructuré et adapté en composants Angular fonctionnels** en se basant sur les fichiers HTML statiques fournis.

### ✅ Fichiers adapté vers Angular

| Fichier HTML Original | Composant Angular | État |
|----------------------|-------------------|------|
| home.html | home.component | ✅ Complet |
| teams.html | teams.component | ✅ Complet |
| schedule.html | schedule.component | ✅ Complet |
| shop.html | shop.component | ✅ Complet |
| membership.html | membership.component | ✅ Complet |
| news.html | news.component | ✅ Complet |
| admin.html | admin.component | ✅ Complet |

### 🎯 Modifications principales

#### 1. **Service API (api.service.ts)**
- Créé pour centraliser tous les appels HTTP vers le back-end Spring Boot
- Endpoints inclus:
  - `/api/teams` - Récupérer les équipes
  - `/api/events` - Récupérer les événements
  - `/api/products` - Récupérer les produits
  - `/api/memberships` - Récupérer les memberships
  - `/api/posts` - Récupérer les actualités
  - `/api/admin/login` - Authentification admin
  - `/api/admin/scrims` - Gestion des scrims

#### 2. **Composant Home**
- Charge les données depuis tous les endpoints
- Affiche les aperçus: Teams, Products, Memberships, Posts
- Statistiques en temps réel
- Responsive et stylisé avec Tailwind CSS

#### 3. **Composant Teams**
- Filtrage par jeu (all, lol, valorant, academy)
- Affichage en grille avec détails
- Statistiques globales
- Palmarès

#### 4. **Composant Schedule**
- Liste des événements avec filtres (match, scrim, fanmeet)
- Affichage du jour et horaire
- Formatage des dates en français
- Informations sur les opérations

#### 5. **Composant Shop**
- Système de panier complet
- Filtrage par catégorie
- Calcul du total et des quantités
- Stock disponible
- Responsive

#### 6. **Composant Membership**
- Affichage des formules d'abonnement
- Avantages listés
- Système de souscription
- Fidélité et points

#### 7. **Composant News**
- Grille de posts/actualités
- Affichage des dates formatées
- Catégories de news
- Section modération

#### 8. **Composant Admin**
- **Authentification sécurisée** (login/logout)
- **Dashboard** avec statistiques des scrims
- **Gestion des scrims** (approuver/rejeter)
- **Planification** (agenda par jour)
- Sidebar navigation
- Persistance avec localStorage
- Responsive

### 🔧 Architecture

```
Front-end/
├── src/
│   ├── app/
│   │   ├── app.ts (AppComponent - Racine)
│   │   ├── app.config.ts (Configuration avec provider Router)
│   │   ├── app.routes.ts (Routes définies)
│   │   ├── app.html (Layout avec navigation)
│   │   ├── app.css (Styles globaux)
│   │   ├── components/
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   └── home.component.css
│   │   │   ├── teams/
│   │   │   ├── schedule/
│   │   │   ├── shop/
│   │   │   ├── membership/
│   │   │   ├── news/
│   │   │   └── admin/
│   │   └── services/
│   │       └── api.service.ts (Service HTTP centralisé)
│   ├── main.ts (Bootstrap)
│   └── index.html
├── package.json
├── angular.json
└── tailwind.config.json
```

### 📦 Dépendances utilisées

- **Angular 21+**: Framework
- **Angular Common HTTP**: Appels API REST
- **Tailwind CSS**: Styling
- **RxJS**: Gestion des Observables

### 🚀 Démarrage du projet

```bash
# Installation des dépendances
npm install

# Mode développement (port 4200)
npm start

# Build production
npm run build

# Tests
npm test
```

### 🌐 Connexion au Back-end

Le service API est configuré pour se connecter au back-end Spring Boot sur:
```
http://localhost:8080/api
```

**À adapter** dans `src/app/services/api.service.ts` si votre serveur est sur un autre port.

### 🔐 Authentification Admin

**Détails de connexion par défaut:**
- Utilisateur: `admin`
- Mot de passe: À recevoir du back-end

Les sessions sont conservées avec localStorage.

### 📱 Responsive Design

Tous les composants sont fully responsive:
- Mobile-first
- Grid adaptatifs (md:, lg:)
- Navigation tactile
- Modales adaptées

### ✨ Fonctionnalités clés

✅ **Routage complet** - Navigation fluide entre pages
✅ **API intégrée** - Connexion back-end fonctionnelle
✅ **Authentification** - Admin panel sécurisé
✅ **Panier** - Gestion complète des produits
✅ **Filtres** - Tous les composants supportent le filtrage
✅ **Formatage** - Dates, prix, quantités formatés
✅ **Tailwind CSS** - Styling moderne et responsive

### 🎨 Palette de couleurs

- **Primary**: `#e60012` (Rouge KJX)
- **Background**: `#0f0f11` (Noir profond)
- **Secondary**: `#1a1a1a` (Gris foncé)

### 📝 Notes importantes

1. **HttpClientModule** intégré au composant racine
2. **FormsModule** ajouté aux composants avec formulaires
3. **CommonModule** présent dans tous les composants standalone
4. **RouterModule** configuré globalement via app.config.ts
5. **Standalone components** - Architecture moderne Angular

---

**Statut**: ✅ **OPÉRATIONNEL**
Build compile avec succès, serveur démarre sur port 4200/4300.


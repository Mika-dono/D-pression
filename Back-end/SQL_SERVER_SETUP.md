# ============================================
# GUIDE DE CONFIGURATION SQL SERVER
# Pour l'équipe D-Pression
# ============================================

## 📋 PRÉREQUIS

1. **SQL Server** installé (Express, Developer ou Standard)
2. **SQL Server Management Studio (SSMS)** pour exécuter les scripts
3. **Java 17+** installé

---

## 🚀 ÉTAPES D'INSTALLATION

### Étape 1 : Créer la base de données

1. Ouvrir **SQL Server Management Studio (SSMS)**
2. Se connecter à votre serveur SQL Server local
3. Exécuter les scripts dans l'ordre :
   - `Back-end/sql/01_CREATE_DATABASE.sql` → Crée la base `dpression_db`
   - `Back-end/sql/02_CREATE_TABLES.sql` → Crée toutes les tables
   - `Back-end/sql/03_INSERT_DATA.sql` → Insère les données de test

### Étape 2 : Configurer la connexion

1. Ouvrir `Back-end/src/main/resources/application-sqlserver.properties`
2. Modifier les paramètres de connexion :

```properties
# Remplacer par vos informations
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=dpression_db;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=VotreMotDePasse123!
```

### Étape 3 : Lancer l'application avec le profil SQL Server

```bash
# Windows PowerShell
cd Back-end
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=sqlserver

# Ou définir la variable d'environnement
$env:SPRING_PROFILES_ACTIVE="sqlserver"
.\mvnw.cmd spring-boot:run
```

---

## 🔧 CONFIGURATION SQL SERVER

### Activer l'authentification SQL Server

1. Ouvrir SSMS
2. Clic droit sur le serveur → **Propriétés**
3. **Sécurité** → Choisir **Mode d'authentification SQL Server et Windows**
4. Redémarrer le service SQL Server

### Configurer le compte SA

```sql
-- Dans SSMS, exécuter :
ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = 'VotreMotDePasse123!';
```

### Vérifier le port TCP/IP

1. Ouvrir **SQL Server Configuration Manager**
2. **SQL Server Network Configuration** → **Protocols for MSSQLSERVER**
3. Activer **TCP/IP**
4. Propriétés TCP/IP → **IP Addresses** → **IPAll** → **TCP Port** = `1433`
5. Redémarrer le service SQL Server

---

## 📁 STRUCTURE DES SCRIPTS SQL

```
Back-end/sql/
├── 01_CREATE_DATABASE.sql   # Création de la BDD
├── 02_CREATE_TABLES.sql     # Création des tables
└── 03_INSERT_DATA.sql       # Données initiales
```

---

## 🔄 BASCULER ENTRE H2 ET SQL SERVER

### Utiliser H2 (développement rapide)
```bash
.\mvnw.cmd spring-boot:run
# Utilise le profil par défaut (H2)
```

### Utiliser SQL Server (production)
```bash
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=sqlserver
```

---

## ⚠️ DÉPANNAGE

### Erreur : "Cannot connect to SQL Server"
- Vérifier que SQL Server est démarré
- Vérifier que TCP/IP est activé sur le port 1433
- Vérifier les identifiants (username/password)

### Erreur : "Login failed for user 'sa'"
- Activer le compte SA (voir section ci-dessus)
- Vérifier le mode d'authentification

### Erreur : "The TCP/IP connection failed"
- Ouvrir le port 1433 dans le pare-feu Windows
- Vérifier que le service SQL Server Browser est démarré

---

## 📊 TABLES CRÉÉES

| Table | Description |
|-------|-------------|
| `teams` | Équipes esport |
| `players` | Joueurs |
| `events` | Événements |
| `matches` | Matchs programmés |
| `scrims` | Demandes de scrims |
| `schedules` | Emplois du temps |
| `posts` | Articles/News |
| `products` | Boutique |
| `memberships` | Adhésions |
| `users` | Utilisateurs admin |

---

## 🎮 CONNEXION ADMIN

- **URL** : http://localhost:4200/admin
- **Username** : `admin`
- **Password** : `admin123`

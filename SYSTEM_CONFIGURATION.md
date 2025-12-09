# D-pression System Configuration Guide

## 📋 Complete System Setup & URIs

### 1. Backend API Configuration

**Base URL:** `http://localhost:8080`

#### Authentication Endpoints
- **Login:** `POST /auth/login`
  - Default Credentials:
    - Username: `admin`
    - Password: `admin123`

#### API Endpoints

##### Teams (`/api/teams`)
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team
- `GET /api/teams/{id}` - Get team by ID
- `PUT /api/teams/{id}` - Update team
- `DELETE /api/teams/{id}` - Delete team

##### Players (`/api/players`)
- `GET /api/players` - Get all players
- `POST /api/players` - Create new player
- `GET /api/players/{id}` - Get player by ID
- `PUT /api/players/{id}` - Update player
- `DELETE /api/players/{id}` - Delete player

##### Events (`/api/events`)
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/{id}` - Get event by ID
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

##### Schedule (`/api/schedule`)
- `GET /api/schedule` - Get schedule
- `POST /api/schedule` - Create schedule entry
- `PUT /api/schedule/{id}` - Update schedule

##### Matches (`/api/matches`)
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create new match
- `GET /api/matches/{id}` - Get match by ID
- `PUT /api/matches/{id}` - Update match
- `DELETE /api/matches/{id}` - Delete match

##### Scrims (`/api/scrims`)
- `GET /api/scrims` - Get all scrim requests
- `POST /api/scrims` - Create scrim request
- `GET /api/scrims/{id}` - Get scrim by ID
- `PUT /api/scrims/{id}` - Update scrim
- `DELETE /api/scrims/{id}` - Delete scrim

##### Health Check
- `GET /actuator/health` - System health status

---

### 2. Frontend Configuration

**URL:** `http://localhost:4200`

#### Login Credentials
- **Username:** `admin`
- **Password:** `admin123`

#### Navigation Sections (Sidebar)
1. **Planning** - Weekly schedule & objectives
2. **Events** - Manage team events
3. **Matches** - Schedule and manage matches
4. **Scrims** - Handle scrim requests
5. **Help** - Documentation & guide

---

### 3. Database Configuration

**Type:** H2 In-Memory Database
**JDBC URL:** `jdbc:h2:mem:ultimate_db`

#### Database Tables
- `teams` - Team information
- `players` - Player roster
- `events` - Team events
- `schedule` - Weekly schedule
- `matches` - Match records
- `scrims` - Scrim requests

#### Connection Details
- **Driver:** `org.h2.Driver`
- **Username:** `sa`
- **Password:** (empty)
- **Port:** Not applicable (in-memory)

---

### 4. Environment Variables

Create `.env` file in project root:

```env
# Backend
BACKEND_URL=http://localhost:8080
API_BASE_URL=http://localhost:8080/api

# Frontend
FRONTEND_URL=http://localhost:4200
ENVIRONMENT=development

# Database
DB_TYPE=h2
DB_URL=jdbc:h2:mem:ultimate_db
DB_USERNAME=sa
DB_PASSWORD=

# Authentication
DEFAULT_USERNAME=admin
DEFAULT_PASSWORD=admin123
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000

# Application
APP_NAME=D-pression
APP_VERSION=1.0.0
LOG_LEVEL=INFO
```

---

### 5. How to Start the System

#### Step 1: Start Backend
```bash
cd Back-end
mvn clean package
java -jar target/KJX-0.0.1-SNAPSHOT.jar
```

Or using Maven directly:
```bash
cd Back-end
mvn spring-boot:run
```

**Expected Output:**
```
Started KJX in X.XXX seconds (JVM running for X.XXX)
Tomcat initialized with port: 8080
```

#### Step 2: Start Frontend
```bash
cd Front-end
npm install
ng serve --port 4200
```

Or:
```bash
cd Front-end
npm start
```

**Expected Output:**
```
Application bundle generation complete. [X.XXX seconds]
✔ Compiled successfully.
```

#### Step 3: Access the Application
1. Open browser: `http://localhost:4200`
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`

---

### 6. API Request Examples

#### Authentication
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

#### Get All Teams
```bash
curl -X GET http://localhost:8080/api/teams \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create Event
```bash
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Training Session",
    "type": "training",
    "date": "2025-12-10",
    "time": "19:00",
    "description": "Weekly training"
  }'
```

#### Get Schedule
```bash
curl -X GET http://localhost:8080/api/schedule \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create Match
```bash
curl -X POST http://localhost:8080/api/matches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "tournament": "League Season 1",
    "format": "Bo3",
    "team1": "KJX",
    "team2": "Opponent",
    "date": "2025-12-15",
    "time": "20:00"
  }'
```

---

### 7. Frontend Feature URIs

#### Sidebar Navigation
- `#/admin/planning` - Schedule & objectives
- `#/admin/events` - Event management
- `#/admin/matches` - Match management
- `#/admin/scrims` - Scrim requests
- `#/admin/help` - Help & documentation

#### Main Site Links
- Home: `/`
- Rosters: `/rosters`
- Schedule: `/schedule`
- Shop: `/shop`
- Membership: `/membership`
- News: `/news`

---

### 8. Technology Stack

**Frontend:**
- Angular 21.0.0
- TypeScript 5.9.2
- Tailwind CSS 4.1.12
- Node.js + npm

**Backend:**
- Spring Boot 4.0.0
- Java 17
- Maven
- H2 Database
- Spring Data JPA

**Development Tools:**
- VS Code
- Angular CLI
- Maven
- Git

---

### 9. File Structure

```
D-pression/
├── Back-end/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/KJX/
│   │   │   │   ├── controller/
│   │   │   │   ├── entity/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/migration/
│   │   └── test/
│   ├── pom.xml
│   └── target/
├── Front-end/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── app.routes.ts
│   │   ├── main.ts
│   │   └── styles.css
│   ├── package.json
│   ├── angular.json
│   └── dist/
└── Ultimate_db/
    └── app.js
```

---

### 10. Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8080 in use | `netstat -ano \| findstr :8080` then kill process |
| Port 4200 in use | `netstat -ano \| findstr :4200` then kill process |
| Maven build fails | Run `mvn clean install` |
| npm install fails | Delete `node_modules` and `package-lock.json`, then `npm install` |
| Angular compilation error | Run `ng build --configuration development` |
| Backend not responding | Check if Spring Boot is running on 8080 |
| Database connection error | H2 is in-memory; ensure backend hasn't crashed |

---

### 11. Default Credentials Summary

| Service | Username | Password | Note |
|---------|----------|----------|------|
| Admin Panel | `admin` | `admin123` | Default login |
| Database | `sa` | (empty) | H2 default |
| API | JWT Token | (from login) | Required for all requests |

---

### 12. Development Commands

```bash
# Backend
cd Back-end
mvn clean compile          # Compile only
mvn clean package          # Build JAR
mvn spring-boot:run        # Run directly
mvn clean test             # Run tests

# Frontend
cd Front-end
npm install                # Install dependencies
npm start                  # Start dev server
ng build                   # Build for production
ng build --configuration development  # Dev build
npm run lint               # Run linter
npm test                   # Run unit tests
```

---

### 13. Ports Summary

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Backend API | 8080 | http://localhost:8080 | Spring Boot |
| Frontend App | 4200 | http://localhost:4200 | Angular CLI |
| H2 Console | (In-Memory) | N/A | Database only |

---

**Last Updated:** December 9, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

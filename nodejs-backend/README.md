# KJX Esports - Node.js Backend

Backend API for KJX Esports organization, converted from Spring Boot to Node.js + Express + Sequelize.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- SQL Server (or SQL Server Express)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd nodejs-backend
npm install
```

2. **Configure environment:**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials
```

3. **Database Setup:**

For SQL Server:
```bash
# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

4. **Start the server:**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server runs at: **http://localhost:3000**

## 📁 Project Structure

```
nodejs-backend/
├── src/
│   ├── app.js                 # Main entry point
│   ├── config/
│   │   └── database.js        # Sequelize configuration
│   ├── controllers/           # Route handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── team.controller.js
│   │   ├── event.controller.js
│   │   ├── match.controller.js
│   │   ├── membership.controller.js
│   │   ├── payment.controller.js
│   │   ├── post.controller.js
│   │   ├── product.controller.js
│   │   ├── schedule.controller.js
│   │   └── scrim.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT authentication
│   │   ├── errorHandler.js        # Error handling
│   │   └── validation.middleware.js
│   ├── models/                # Sequelize models
│   │   ├── index.js           # Model loader & associations
│   │   ├── User.js
│   │   ├── Team.js
│   │   ├── TeamMember.js
│   │   ├── Event.js
│   │   ├── Match.js
│   │   ├── Membership.js
│   │   ├── Payment.js
│   │   ├── Post.js
│   │   ├── Product.js
│   │   ├── Schedule.js
│   │   └── Scrim.js
│   ├── routes/                # Express routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── team.routes.js
│   │   ├── event.routes.js
│   │   ├── match.routes.js
│   │   ├── membership.routes.js
│   │   ├── payment.routes.js
│   │   ├── post.routes.js
│   │   ├── product.routes.js
│   │   ├── schedule.routes.js
│   │   └── scrim.routes.js
│   ├── services/              # Business logic
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── team.service.js
│   │   ├── event.service.js
│   │   ├── match.service.js
│   │   ├── membership.service.js
│   │   ├── payment.service.js
│   │   ├── post.service.js
│   │   ├── product.service.js
│   │   ├── schedule.service.js
│   │   └── scrim.service.js
│   └── database/
│       ├── migrations/        # Sequelize migrations
│       └── seeders/           # Seed data
├── .env                       # Environment config
├── .env.example               # Example env file
├── .sequelizerc               # Sequelize CLI config
└── package.json
```

## 🔐 Authentication

JWT-based authentication with SHA-256 password hashing (compatible with Spring Boot).

### Default Admin Credentials:
- **Username:** admin
- **Password:** admin123

### Auth Endpoints:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Admin login |
| POST | `/auth/user/login` | User login |
| POST | `/auth/register` | Register new user |
| POST | `/auth/logout` | Logout |

### Using JWT Token:
```http
Authorization: Bearer <your-jwt-token>
```

## 📡 API Endpoints

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | ✅ | Get all users |
| GET | `/api/users/:id` | ✅ | Get user by ID |
| GET | `/api/users/role/:role` | ✅ | Get users by role |
| GET | `/api/users/stats` | ✅ | Get user statistics |
| POST | `/api/users` | ✅ Admin | Create user |
| PUT | `/api/users/:id` | ✅ | Update user |
| PATCH | `/api/users/:id/toggle-active` | ✅ Admin | Toggle active |
| DELETE | `/api/users/:id` | ✅ Admin | Delete user |

### Teams
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/teams` | ❌ | Get all teams |
| GET | `/api/teams/:id` | ❌ | Get team by ID |
| GET | `/api/teams/game/:game` | ❌ | Get teams by game |
| POST | `/api/teams` | ✅ Admin | Create team |
| PUT | `/api/teams/:id` | ✅ Admin | Update team |
| DELETE | `/api/teams/:id` | ✅ Admin | Delete team |

### Events
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/events` | ❌ | Get all events |
| GET | `/api/events/:id` | ❌ | Get event by ID |
| GET | `/api/events/upcoming` | ❌ | Get upcoming events |
| GET | `/api/events/type/:type` | ❌ | Get events by type |
| GET | `/api/events/team/:teamId` | ❌ | Get events by team |
| POST | `/api/events` | ✅ Admin | Create event |
| PUT | `/api/events/:id` | ✅ Admin | Update event |
| DELETE | `/api/events/:id` | ✅ Admin | Delete event |

### Matches
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/matches` | ❌ | Get all matches |
| GET | `/api/matches/visible` | ❌ | Get visible matches |
| GET | `/api/matches/upcoming` | ❌ | Get upcoming matches |
| GET | `/api/matches/:id` | ❌ | Get match by ID |
| POST | `/api/matches` | ✅ Admin | Create match |
| PUT | `/api/matches/:id` | ✅ Admin | Update match |
| PATCH | `/api/matches/:id/toggle` | ✅ Admin | Toggle visibility |
| DELETE | `/api/matches/:id` | ✅ Admin | Delete match |

### Memberships
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/memberships` | ❌ | Get all memberships |
| GET | `/api/memberships/active` | ❌ | Get active memberships |
| GET | `/api/memberships/:id` | ❌ | Get by ID |
| POST | `/api/memberships` | ✅ Admin | Create |
| PUT | `/api/memberships/:id` | ✅ Admin | Update |
| DELETE | `/api/memberships/:id` | ✅ Admin | Delete |

### Payments (FAKE/TEST API)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/payments` | ✅ Admin | Get all payments |
| GET | `/api/payments/stats` | ✅ Admin | Get statistics |
| GET | `/api/payments/:id` | ✅ | Get by ID |
| POST | `/api/payments/card` | ❌ | Process card payment |
| POST | `/api/payments/paypal/create` | ❌ | Create PayPal intent |
| POST | `/api/payments/paypal/confirm` | ❌ | Confirm PayPal |
| POST | `/api/payments/stripe/create` | ❌ | Create Stripe intent |
| POST | `/api/payments/stripe/confirm` | ❌ | Confirm Stripe |
| POST | `/api/payments/wise/create` | ❌ | Create Wise transfer |
| POST | `/api/payments/wise/confirm` | ❌ | Confirm Wise |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ | Get all products |
| GET | `/api/products/featured` | ❌ | Get featured |
| GET | `/api/products/category/:cat` | ❌ | Get by category |
| GET | `/api/products/:id` | ❌ | Get by ID |
| POST | `/api/products` | ✅ Admin | Create |
| PUT | `/api/products/:id` | ✅ Admin | Update |
| DELETE | `/api/products/:id` | ✅ Admin | Delete |

### Posts/News
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/posts` | ❌ | Get all posts |
| GET | `/api/posts/published` | ❌ | Get published |
| GET | `/api/posts/category/:cat` | ❌ | Get by category |
| GET | `/api/posts/:id` | ❌ | Get by ID (increments views) |
| POST | `/api/posts` | ✅ Admin | Create |
| PUT | `/api/posts/:id` | ✅ Admin | Update |
| DELETE | `/api/posts/:id` | ✅ Admin | Delete |

### Schedules
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/schedules` | ❌ | Get all |
| GET | `/api/schedules/day/:day` | ❌ | Get by day |
| GET | `/api/schedules/team/:teamId` | ❌ | Get by team |
| POST | `/api/schedules` | ✅ Admin | Create |
| POST | `/api/schedules/day` | ✅ Admin | Upsert by day |
| PUT | `/api/schedules/:id` | ✅ Admin | Update |
| DELETE | `/api/schedules/:id` | ✅ Admin | Delete |

### Scrims
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/scrims` | ❌ | Get all |
| GET | `/api/scrims/status/:status` | ❌ | Get by status |
| GET | `/api/scrims/team/:teamId` | ❌ | Get by team |
| GET | `/api/scrims/:id` | ❌ | Get by ID |
| POST | `/api/scrims` | ✅ Admin | Create |
| PUT | `/api/scrims/:id` | ✅ Admin | Update |
| DELETE | `/api/scrims/:id` | ✅ Admin | Delete |

## 💳 Payment API (Test Mode)

The payment API simulates payment processing for development. Use these test card numbers:

### Test Card Numbers:
| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Success (Visa) |
| 5555 5555 5555 4444 | Success (Mastercard) |
| 3782 8224 6310 005 | Success (Amex) |
| 4000 0000 0000 0002 | Declined |
| Any Luhn-invalid | Invalid card error |

### Card Payment Example:
```json
POST /api/payments/card
{
  "cardNumber": "4242424242424242",
  "cardHolder": "John Doe",
  "expiryMonth": "12",
  "expiryYear": "2025",
  "cvv": "123",
  "amount": 29.99,
  "email": "john@example.com",
  "description": "KJX Supporter Membership"
}
```

## 🗄️ Database Commands

```bash
# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Seed data
npm run db:seed

# Undo seeds
npm run db:seed:undo
```

## 🛠️ Environment Variables

```env
# Server
NODE_ENV=development
PORT=3000

# Database (SQL Server)
DB_HOST=localhost
DB_PORT=1433
DB_NAME=KJX_Esports
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_ENCRYPT=false
DB_TRUST_CERT=true

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:4200,http://localhost:3000
```

## 📱 Flutter Integration

The Flutter app models and services are in `flutter_app/lib/`:
- `models/` - Dart models matching the API
- `services/` - API service classes

Update `ApiService.baseUrl` in Flutter to point to your backend:
```dart
static const String baseUrl = 'http://YOUR_SERVER_IP:3000';
```

## 🧪 Testing with cURL

### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Teams (no auth):
```bash
curl http://localhost:3000/api/teams
```

### Create Team (with auth):
```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"KJX Rocket League","game":"Rocket League"}'
```

## 📝 License

Private - KJX Esports Organization

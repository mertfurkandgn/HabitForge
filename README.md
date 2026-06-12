# HabitForge API

A REST API for habit tracking, built on science-backed principles from *Atomic Habits* and *Tiny Habits*.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express 5
- **Database**: PostgreSQL via Drizzle ORM
- **Auth**: JWT (Bearer token)
- **Validation**: Zod
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker (for PostgreSQL)

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Configure environment
cp .env.example .env
# Fill in your values in .env

# 4. Push database schema
pnpm db:generate
pnpm db:migrate

# 5. Start dev server
pnpm dev
```

Server runs at `http://localhost:3000` by default.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `3000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) |

## API Reference

### Health

```
GET /api/health
```

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Create a new account | No |
| `POST` | `/api/auth/login` | Sign in | No |

#### POST /api/auth/register

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### POST /api/auth/login

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

Both endpoints return:

```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "createdAt": "..." },
    "token": "<jwt>"
  }
}
```

## Project Structure

```
src/
├── config/         # Env validation, database connection
├── db/
│   └── schema/     # Drizzle table definitions
├── middlewares/    # Error handler
├── modules/
│   └── auth/       # Router, service, repository
└── utils/          # AppError, JWT helpers, response helpers
```

## License

MIT

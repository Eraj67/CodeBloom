# CodeBloom Backend

Node.js + Express + PostgreSQL + Prisma API for CodeBloom.

## Prerequisites

- Node.js 18+
- PostgreSQL running locally (or Docker)

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

The API runs at `http://localhost:4000`.

## API Endpoints

### Health
- `GET /api/health`

### Auth
- `POST /api/auth/signup` — `{ email, password }`
- `POST /api/auth/login` — `{ email, password }`
- `POST /api/auth/logout` — requires auth cookie
- `GET /api/auth/me` — requires auth cookie

### Profile
- `GET /api/profile/me` — requires auth
- `PATCH /api/profile/me` — `{ displayName?, bio?, avatarUrl? }`

### Progress
- `GET /api/progress` — list completed items
- `GET /api/progress/summary` — counts by course
- `POST /api/progress/lessons/:lessonId/complete`
- `POST /api/progress/challenges/:challengeId/complete`

### Contact
- `POST /api/contact` — `{ name, email, subject, message }` (rate limited)

## Environment Variables

See [`.env.example`](.env.example).

## Docker Postgres (optional)

```bash
docker run --name codebloom-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=codebloom -p 5432:5432 -d postgres:16
```

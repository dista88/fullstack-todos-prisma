# fullstack-todos-prisma

A full stack todo app with authentication.

## Tech Stack
- Node.js + Express
- PostgreSQL + Prisma
- JWT Authentication
- React + vite

## Features
- Register and login
- Create, read, update, delete todos
- Each user only sees their own todos

## Setup
1. Clone the repo
2. Install dependencies: `npm install`
3. Create `.env` file:
```
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
```
4. Start database: `docker compose up -d`
5. Run migrations: `npx prisma migrate dev`

6. Start server: `npm run dev`

##login page
<img width="594" height="633" alt="Screenshot 2026-02-23 033644" src="https://github.com/user-attachments/assets/dc5f2325-7285-4779-9802-28d047e1e95c" />

##dashboard
<img width="1058" height="964" alt="Screenshot 2026-02-23 033557" src="https://github.com/user-attachments/assets/7f78374b-d148-415e-82bb-020b55e75c33" />




# TournamentHub Full-Stack Application

This repository contains a full-stack web application built to manage online esports tournaments.

## 🚀 Tech Stack
*   **Frontend:** Next.js 15 (React 19), TypeScript, Tailwind CSS
*   **Backend:** Node.js (Express), TypeScript
*   **Database:** PostgreSQL, Prisma ORM
*   **Authentication:** Discord OAuth 2.0

## ⚙️ Project Structure
The application is divided into two main workspaces: `web/` (Frontend) and `backend/` (API).

```
TournamentHub/
├── backend/        # Express API Server
├── web/            # Next.js Frontend Application
├── prisma/         # Prisma ORM Schema and Seed Scripts
├── docker-compose.yml # Container setup for local development
├── README.md       # Instructions
└── .gitignore
```

## 📋 Setup Guide (Local Development)

### 1. Prerequisites
Make sure you have the following installed:
*   ✅ Docker & Docker Compose
*   ✅ Node.js (Recommended v20+)
*   ✅ PostgreSQL (Optional, handled by Docker)

### 2. Environment Variables (.env)
Create a `.env` file in the root `TournamentHub/` directory and fill it with your credentials. **NOTE:** Never commit secrets!

```bash
# Database URL (Used by backend service)
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?sslmode=no

# JWT Secret Key for token signing
JWT_SECRET="YOUR_SUPER_SECRET_KEY"

# Discord OAuth Credentials
DISCORD_CLIENT_ID="YOUR_DISCORD_CLIENT_ID"
DISCORD_CLIENT_SECRET="YOUR_DISCORD_CLIENT_SECRET"
```

### 3. Database and Backend Setup (Docker)
We use `docker-compose` to run the PostgreSQL database and the Node.js backend API simultaneously.

**a. Start Services:**
Run the following command in the root `TournamentHub/` directory:
```bash
docker-compose up --build db
```
This will initialize the PostgreSQL container and wait for the database to be ready. (Note: We handle backend startup separately later).

**b. Run Migrations:**
Once the DB is running, run Prisma migrations from within a connected service or use `npx prisma migrate dev`. For simplicity with Docker setup:
```bash
docker-compose exec backend npx prisma db push --schema=./prisma/schema.prisma
# Alternatively, if developing inside containers, you might need to adjust the migration command path. 

# Run Seeds
docker-compose exec backend npx prisma db seed --schema=./prisma/schema.prisma
```

### 4. Frontend Setup (Next.js)
Navigate to the `web/` directory and install dependencies:
```bash
cd web
npm install
npm run dev
# The frontend will typically run on http://localhost:3000
```

### 5. Backend Development (`backend/`)
1.  Install remaining dependencies (e.g., express, @prisma/client, bcrypt):
    ```bash
    cd backend
    npm install
    ```
2.  Start the API server (ensuring environment variables are correctly loaded or passed to Docker environment).

### 6. Quick Start: Creating an Admin User
The database schema requires a dedicated admin user setup via `seed.ts`. Update the seed file with your actual initial ADMIN Discord ID, then re-run the seeding command.

## 🚀 Deployment (Vercel & Production)
For deployment to Vercel/Production environments:
1.  Ensure all environment variables are set in the Vercel dashboard settings.
2.  The backend API should be deployed separately (e.g., on Render or a dedicated Node service).
3.  The `web/` Next.js application is highly optimized for Vercel hosting.
4.  Update the final deployment scripts to use production variables and ensure environment isolation (no local `localhost:5432` references).

---
**Next Steps:** I will start with the core backend files, beginning with the Prisma client initialization and basic Express routes/middleware structure in `backend/`.
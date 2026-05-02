# Team Task Manager

A full-stack project management application with role-based access control. Built with React (Vite), Tailwind CSS, Node.js, Express, and MongoDB.

## Features
- **JWT Authentication**: Secure login and signup.
- **Role-Based Access Control**: Admins can manage projects and members; Members can manage assigned tasks.
- **Project Management**: Create projects, add members, view details.
- **Task Management**: Create tasks, assign them to members, update status (Todo, In Progress, Done).
- **Responsive Dashboard**: Beautiful metrics tracking.
- **Modern UI**: Dark-mode inspired premium UI with Tailwind CSS.

## Monorepo Structure
- `/backend`: Express + MongoDB API.
- `/frontend`: React + Vite Frontend.

## Environment Variables
Create a `.env` file in the `/backend` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_uri_here
JWT_SECRET=your_jwt_secret_key_here
```

## Running Locally

Requires Node.js (v18+) installed.

1. **Install dependencies** (from the root folder):
   ```bash
   npm install
   ```

2. **Run both backend and frontend concurrently**:
   ```bash
   npm run dev
   ```
   - Frontend runs on `http://localhost:5173`
   - Backend API runs on `http://localhost:5000`

## Deployment (Railway)

This repository is configured for single-click deployment on Railway or any platform that supports Node.js monorepos.

1. Push this repository to GitHub.
2. In Railway, create a new project from GitHub.
3. Railway will automatically detect the root `package.json` and install dependencies.
4. Set the Environment Variables (`MONGO_URI`, `JWT_SECRET`) in Railway's Variables section.
5. Railway will automatically build the frontend (`npm run build`) and start the backend (`npm start`). The backend serves the production frontend build.

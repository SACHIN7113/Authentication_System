# Full-Stack Authentication System (FastAPI + React + MongoDB + JWT)

This project is a complete authentication system with strong password policy, protected routes, profile dashboard, and change-password flow.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, React Router, Axios, React Icons
- Backend: FastAPI (Python)
- Database: MongoDB (Local or Atlas)
- Authentication: JWT (Bearer Token)

## Current Feature Set

1. User registration with validation
2. User login with JWT token generation
3. Protected profile API and protected frontend routes
4. Change password flow (authenticated users)
5. Password hashing using `passlib + bcrypt`
6. Password policy enforcement
7. Token handling in frontend using `localStorage`
8. Axios client with auth header and 401 handling

## Password Policy

Passwords must contain:

1. At least 6 characters
2. At least one uppercase letter
3. At least one number
4. At least one special character

Policy is validated in backend and frontend.

## Project Structure

```text
Clg_Project/
  backend/
    app/
      middlewares/
      models/
      routes/
      services/
      utils/
    config.py
    db.py
    main.py
    requirements.txt
    .env.example
  frontend/
    public/
    src/
      components/
      hooks/
      pages/
      routes/
      services/
      main.jsx
    package.json
  docs/
    PROJECT_FLOW.md
```

## Backend API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/change-password` (protected)
- `GET /api/profile` (protected)

## Frontend Routes

- `/login`
- `/register`
- `/profile` (protected)
- `/change-password` (protected)

## Setup and Run

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

## Environment Variables

Backend (`backend/.env`):

- `MONGO_URI`
- `MONGO_DB_NAME`
- `JWT_SECRET_KEY`
- `JWT_ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `CORS_ORIGINS`

Frontend (`frontend/.env`):

- `VITE_API_BASE_URL`

## Security Notes

1. Passwords are never stored in plain text.
2. JWT is validated on protected requests.
3. 401 responses clear token and redirect to login.
4. MongoDB `users.email` has a unique index.
5. Use strong `JWT_SECRET_KEY` in production.
6. Rotate credentials if accidentally exposed.

## Cloud Deployment (Suggested)

1. Use MongoDB Atlas for database.
2. Deploy backend (Render/Railway/Fly.io) with env vars.
3. Deploy frontend (Vercel/Netlify/Render Static).
4. Set frontend `VITE_API_BASE_URL` to deployed backend `/api` URL.
5. Add frontend domain in backend `CORS_ORIGINS`.

## Detailed Documentation

For implementation flow, architecture details, and testing checklist, see:

- `docs/PROJECT_FLOW.md`

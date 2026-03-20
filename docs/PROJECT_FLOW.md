# Project Flow Documentation

## 1. Objective

Build a secure full-stack authentication system with:

1. Register
2. Login
3. JWT-based protected routes
4. Profile page
5. Change password
6. Strong password policy

## 2. Technologies Used

### Backend

- FastAPI
- Motor (MongoDB async driver)
- Pydantic
- passlib + bcrypt
- python-jose (JWT)

### Frontend

- React + Vite
- Tailwind CSS
- React Router
- Axios
- React Icons

### Database

- MongoDB local or MongoDB Atlas

## 3. Backend Architecture Flow

### 3.1 Request Lifecycle

1. Request reaches route in `app/routes`.
2. Route delegates business logic to `app/services`.
3. Service reads/writes MongoDB via `db.py`.
4. Response model from `app/models` is returned.

### 3.2 Auth Security Flow

1. Register:
- Validate payload
- Enforce password policy
- Hash password
- Store user in `users` collection

2. Login:
- Verify email/password
- Generate JWT token
- Return access token

3. Protected APIs:
- Middleware extracts Bearer token
- JWT is decoded and validated
- User is loaded from DB
- Request proceeds only if token/user valid

4. Change Password:
- Verify current password
- Validate new password strength
- Reject same-as-old password
- Hash and update new password

## 4. Frontend Architecture Flow

### 4.1 App Routing

- Public routes:
  - `/login`
  - `/register`
- Protected routes:
  - `/profile`
  - `/change-password`

Protected routes use `ProtectedRoute` component to block unauthenticated access.

### 4.2 API Integration Flow

1. API client is configured in `src/services/api.jsx`.
2. JWT token is read from `localStorage`.
3. Token is sent in `Authorization: Bearer <token>` header.
4. On 401:
- token is removed
- user is redirected to login

### 4.3 Hook Layer

`src/hooks/useAuth.jsx` exposes reusable methods:

- `register`
- `login`
- `loadProfile`
- `updatePassword`
- `signOut`
- `isLoggedIn`

## 5. Password Policy

Applied in frontend and backend:

1. Minimum length: 6
2. At least one uppercase letter
3. At least one digit
4. At least one special character

## 6. Data Model in MongoDB

Collection: `users`

Fields:

- `_id`
- `name`
- `email` (unique index)
- `hashed_password`
- `created_at`
- `updated_at` (when password changes)

## 7. User Journey (End-to-End)

1. User opens Register page.
2. User enters valid details and strong password.
3. Account is created in MongoDB.
4. User logs in and receives JWT token.
5. Token is stored in browser storage.
6. User accesses Profile page.
7. User clicks Settings, then Change Password.
8. Password is updated securely.

## 8. Key Files Reference

### Backend

- `backend/main.py`
- `backend/db.py`
- `backend/config.py`
- `backend/app/routes/auth_routes.py`
- `backend/app/routes/profile_routes.py`
- `backend/app/services/auth_service.py`
- `backend/app/middlewares/auth_middleware.py`
- `backend/app/models/user.py`

### Frontend

- `frontend/src/main.jsx`
- `frontend/src/routes/AppRoutes.jsx`
- `frontend/src/routes/paths.jsx`
- `frontend/src/components/ProtectedRoute.jsx`
- `frontend/src/services/api.jsx`
- `frontend/src/services/authService.jsx`
- `frontend/src/hooks/useAuth.jsx`
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/RegisterPage.jsx`
- `frontend/src/pages/ProfilePage.jsx`
- `frontend/src/pages/ChangePasswordPage.jsx`

## 9. Testing Checklist

1. Register with valid password -> success.
2. Register with weak password -> fail.
3. Login with valid credentials -> success.
4. Access `/profile` without token -> blocked.
5. Change password with wrong current password -> fail.
6. Change password with weak new password -> fail.
7. Change password with strong new password -> success.
8. Login with old password after change -> fail.
9. Login with new password after change -> success.

## 10. Deployment Summary

### Local

- Run backend on `:8000`
- Run frontend on `:5173`

### Cloud

1. Host MongoDB in Atlas
2. Deploy backend and set env vars
3. Deploy frontend and configure API base URL
4. Configure CORS with frontend domain

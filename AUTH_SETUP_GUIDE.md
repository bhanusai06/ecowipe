# Complete Authentication System Setup & Debugging Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [File Structure](#file-structure)
4. [Environment Setup](#environment-setup)
5. [Testing with Postman](#testing-with-postman)
6. [Debugging Common Issues](#debugging-common-issues)
7. [Security Features](#security-features)
8. [API Documentation](#api-documentation)

---

## Quick Start

### 1. Install Dependencies

```bash
# Frontend
npm install axios

# Backend
cd server
npm install express-rate-limit helmet
```

### 2. Setup Environment Variables

**Frontend (.env or .env.local):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
NODE_ENV=development
```

**Backend (server/.env):**
```env
MONGODB_URI=your-mongodb-uri
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRY=24h
FRONTEND_URL=http://localhost:3000
```

### 3. Update Backend Server

Replace the content of `server/server.js` with code from `server-improved.js`:
```bash
cp server/server-improved.js server/server.js
```

### 4. Update Backend Auth Routes

Replace the content of `server/routes/auth.js` with code from `routes/auth-improved.js`:
```bash
cp server/routes/auth-improved.js server/routes/auth.js
```

### 5. Update Frontend Context

Replace `src/context/AuthContext.js` with the new custom hook approach.

---

## Architecture Overview

### Authentication Flow

```
┌─────────────────┐
│  User Login     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 1. Send Email + Password            │
│    (loginRateLimiter + validation)  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 2. Backend Verifies Password        │
│    (bcrypt compare)                 │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 3. Generate JWT Token               │
│    (expires in 24 hours)            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 4. Store Token in localStorage      │
│    (Frontend)                       │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 5. Redirect to Dashboard            │
│    &/Fetch User Profile             │
└─────────────────────────────────────┘
```

### OTP-Based Registration Flow

```
┌──────────────────┐
│  User Register   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 1. Submit Email                      │
│    (sendOTPRateLimiter + validation) │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 2. Backend Generates & Sends OTP     │
│    (saved in DB, expires in 10 mins) │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 3. User Enters OTP                   │
│    (verifyOTPRateLimiter + validation)
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 4. Backend Verifies OTP              │
│    Returns Temporary Token (15 mins) │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 5. User Sets Password                │
│    (validateRegisterRequest)         │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 6. Backend Verifies Temp Token       │
│    Hashes Password, Saves User       │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 7. Generate JWT Token & Return       │
│    Store Token, Redirect to Dashboard
└──────────────────────────────────────┘
```

---

## File Structure

### Frontend Files to Create/Update

```
src/
├── services/
│   ├── api.js                    # Axios instance with interceptors
│   └── authService.js             # Auth API methods
├── hooks/
│   └── useAuth.js                 # Custom auth hook
├── utils/
│   └── validation.js              # Form validation utilities
├── components/auth/
│   └── PrivateRoute-improved.js    # Protected route component
└── .env.local                      # Environment variables
```

### Backend Files to Create/Update

```
server/
├── middleware/
│   ├── errorHandler.js            # Global error handler
│   ├── validation.js              # Request validation
│   ├── rateLimiter.js             # Rate limiting
│   └── verifyToken-improved.js    # JWT verification
├── routes/
│   └── auth-improved.js            # Auth endpoints
├── server-improved.js              # Main server file
├── .env                            # Environment variables
└── .env.example                    # Environment template
```

---

## Environment Setup

### Frontend

Create `.env.local`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
NODE_ENV=development
```

### Backend

Create `server/.env`:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ecowipe
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_EXPIRY=24h
FRONTEND_URL=http://localhost:3000
```

### Install Required Packages

```bash
# Frontend
npm install axios

# Backend
cd server
npm install bcryptjs jsonwebtoken cors express dotenv mongoose nodemailer
```

---

## Testing with Postman

### 1. Test Send OTP

**POST** `http://localhost:5000/api/auth/send-otp`

Headers:
```json
{
  "Content-Type": "application/json"
}
```

Body:
```json
{
  "email": "user@example.com",
  "type": "register"
}
```

Expected Response (Development):
```json
{
  "message": "OTP sent successfully",
  "devOtp": "123456"
}
```

### 2. Test Verify OTP

**POST** `http://localhost:5000/api/auth/verify-otp`

Headers:
```json
{
  "Content-Type": "application/json"
}
```

Body:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "OTP verified successfully"
}
```

### 3. Test Register

**POST** `http://localhost:5000/api/auth/register`

Headers:
```json
{
  "Content-Type": "application/json"
}
```

Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": "user-id-hash",
  "message": "Account created successfully"
}
```

### 4. Test Login

**POST** `http://localhost:5000/api/auth/login`

Headers:
```json
{
  "Content-Type": "application/json"
}
```

Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user-id",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "message": "Login successful"
}
```

### 5. Test Get Current User (Protected)

**GET** `http://localhost:5000/api/auth/me`

Headers:
```json
{
  "Content-Type": "application/json",
  "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Expected Response:
```json
{
  "_id": "user-id",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "created_at": "2024-02-27T00:00:00.000Z"
}
```

---

## Debugging Common Issues

### Issue 1: "CORS policy violation"

**Symptoms:** Request fails with CORS error

**Solutions:**
1. Check `FRONTEND_URL` in `.env` matches your frontend
2. Ensure API server is running on correct port
3. Check allowed origins in `server-improved.js`

```env
# .env
FRONTEND_URL=http://localhost:3000
```

### Issue 2: "Token has expired"

**Symptoms:** Login works but user is logged out after reload

**Solutions:**
1. Check `JWT_EXPIRY` in `.env` (default: 24h)
2. Check token is being stored in localStorage
3. Verify token expiry check in `useAuth` hook

```env
# .env
JWT_EXPIRY=24h
```

### Issue 3: "Passwords do not match"

**Symptoms:** Registration fails with password mismatch

**Solutions:**
1. Use the validation utility: `validatePassword(pwd)`
2. Check password meets requirements:
   - Min 8 characters
   - 1 uppercase letter
   - 1 lowercase letter
   - 1 number
   - 1 special character

### Issue 4: "Too many login attempts"

**Symptoms:** Login blocked with rate limit error

**Solutions:**
1. This is **intentional** - max 5 attempts per 15 minutes
2. Wait 15 minutes or restart server to reset
3. Adjust `maxAttempts` in `rateLimiter.js` middleware

### Issue 5: "API Base URL mismatch"

**Symptoms:** Requests going to wrong endpoint

**Solutions:**
1. Check `REACT_APP_API_URL` in `.env.local`
2. Ensure no trailing slash: `http://localhost:5000`
3. Check API routes are registered in server

```env
# .env.local
REACT_APP_API_URL=http://localhost:5000
```

### Issue 6: "Invalid token"

**Symptoms:** Protected routes return 401

**Solutions:**
1. Token must be in header as `auth-token`
2. Token must not be expired
3. Check `JWT_SECRET` matches frontend and backend

```javascript
// Verify header is correct
headers: {
  'auth-token': token
}
```

### Issue 7: "MongoDB connection failed"

**Symptoms:** Server can't connect to database

**Solutions:**
1. Check `MONGODB_URI` in `.env`
2. Verify MongoDB Atlas whitelist IP
3. Check credentials in connection string
4. Test connection: `mongo "mongodb+srv://..."`

---

## Security Features

### 1. Password Hashing
- Uses bcryptjs with 10 salt rounds
- Passwords never stored in plain text
- Server never returns password in responses

### 2. Rate Limiting
- Login: 5 attempts per 15 minutes per IP
- Send OTP: 3 attempts per 5 minutes per email
- Verify OTP: 5 attempts per 5 minutes per email

### 3. JWT Tokens
- Expires in 24 hours (configurable)
- Verified on every protected request
- Temporary tokens for OTP flow (15 min expiry)

### 4. Input Validation
- Email format validation
- Password strength requirements
- OTP format (6 digits)
- Name length limits
- XSS prevention via sanitization

### 5. CORS Protection
- Only allowed origins can make requests
- Credentials sent with requests
- Proper HTTP methods

### 6. Error Messages
- Generic "invalid email or password" (prevents user enumeration)
- No stack traces in production
- Safe error responses to client

---

## API Documentation

### Authentication Endpoints

#### POST /api/auth/send-otp
Send OTP to email for registration or password reset

**Request:**
```json
{
  "email": "user@example.com",
  "type": "register|reset"
}
```

**Response (200):**
```json
{
  "message": "OTP sent successfully",
  "devOtp": "123456"  // Dev mode only
}
```

**Rate Limit:** 3 per 5 minutes per email

---

#### POST /api/auth/verify-otp
Verify OTP code

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGc...",
  "message": "OTP verified successfully"
}
```

**Rate Limit:** 5 per 5 minutes per email

---

#### POST /api/auth/register
Complete registration after OTP verification

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "token": "eyJhbGc..."
}
```

**Response (201):**
```json
{
  "token": "eyJhbGc...",
  "user": "user-id",
  "message": "Account created successfully"
}
```

---

#### POST /api/auth/login
Login with email and password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "_id": "user-id",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "message": "Login successful"
}
```

**Rate Limit:** 5 per 15 minutes per IP

---

#### POST /api/auth/reset-password
Reset password after OTP verification

**Request:**
```json
{
  "email": "user@example.com",
  "password": "NewPass123!",
  "token": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "message": "Password reset successfully. Please login with your new password."
}
```

---

#### POST /api/auth/google
Google OAuth login/registration

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "googleId": "google-id-string"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGc...",
  "message": "Google login successful"
}
```

---

#### GET /api/auth/me
Get current user profile (Protected)

**Headers:**
```
auth-token: eyJhbGc...
```

**Response (200):**
```json
{
  "_id": "user-id",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "user",
  "total_eco_points": 0
}
```

---

## Frontend Implementation Examples

### Using the useAuth Hook

```javascript
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const { login, error, loading } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // Redirect happens automatically
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
      {/* Form */}
    </div>
  );
}
```

### Using PrivateRoute

```javascript
import PrivateRoute from '@/components/auth/PrivateRoute';
import Dashboard from '@/pages/Dashboard';

<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route 
    path="/dashboard" 
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    } 
  />
</Routes>
```

### Using Auth Service Directly

```javascript
import authService from '@/services/authService';

// Send OTP
const response = await authService.sendOTP('user@example.com', 'register');
console.log(response.devOtp); // In dev mode

// Verify OTP
const { token } = await authService.verifyOTP('user@example.com', otpCode);

// Register
await authService.register(email, password, fullName, token);

// Login
const loginResponse = await authService.login(email, password);
console.log(loginResponse.token);

// Logout
authService.logout();
```

---

## Testing Checklist

- [ ] User can register with OTP
- [ ] User can login with email/password
- [ ] User can login with Google
- [ ] Password reset works
- [ ] Protected routes redirect to login
- [ ] Token stored in localStorage
- [ ] Rate limiting prevents abuse
- [ ] Invalid credentials show error
- [ ] Token expiry logs user out
- [ ] Cross-tab logout synchronization works

---

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Change `JWT_SECRET` to strong random value
- [ ] Update `MONGODB_URI` to production database
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Enable HTTPS
- [ ] Use environment variables from CI/CD
- [ ] Remove `devOtp` from responses
- [ ] Add database backups
- [ ] Setup monitoring and logging
- [ ] Test all auth flows end-to-end

---

For more help, check server logs: `npm run server:dev` and browser DevTools (F12)

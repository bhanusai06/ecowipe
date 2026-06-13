# Step-by-Step Integration Guide

## Overview
This guide will help you integrate the improved authentication system into the existing EcoWIPE application without breaking any existing functionality.

---

## Phase 1: Backend Setup (15-20 minutes)

### Step 1: Check Dependencies
Verify these are in `server/package.json`:
```json
{
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^8.18.2",
    "nodemailer": "^8.0.1"
  }
}
```

If missing, run:
```bash
cd server
npm install bcryptjs cors dotenv express jsonwebtoken mongoose nodemailer
```

### Step 2: Create Middleware Files

Create the following files in `server/middleware/`:

1. **errorHandler.js** (copy from provided code)
2. **validation.js** (copy from provided code)
3. **rateLimiter.js** (copy from provided code)
4. **verifyToken-improved.js** (copy from provided code)

### Step 3: Update Auth Routes

Replace `server/routes/auth.js` with the improved version OR:

1. Backup current auth.js: `cp auth.js auth-original.js`
2. Copy new code: `cp auth-improved.js auth.js`

### Step 4: Update Server Configuration

Update `server/server.js` to include:

```javascript
// Add at top
const errorHandler = require('./middleware/errorHandler');

// After routes (before 404 handler)
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Must be LAST
app.use(errorHandler);
```

### Step 5: Update .env

Update `server/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=change-this-to-a-long-random-string-min-32-chars-ABCDEF123456789
JWT_EXPIRY=24h
MONGODB_URI=your-existing-mongodb-uri
FRONTEND_URL=http://localhost:3000
```

### Step 6: Test Backend

```bash
cd server
npm run dev
```

Visit: http://localhost:5000/health

Should return: `{ "status": "OK", "timestamp": "..." }`

---

## Phase 2: Frontend Setup (20-25 minutes)

### Step 1: Check Dependencies

Add axios if not present:
```bash
npm install axios
```

### Step 2: Create Service Files

Create `src/services/` directory:
```bash
mkdir -p src/services
```

Create files:
1. **api.js** (copy from provided code)
2. **authService.js** (copy from provided code)

### Step 3: Create Hooks Directory

```bash
mkdir -p src/hooks
```

Copy **useAuth.js** to `src/hooks/useAuth.js`

### Step 4: Create Utils

```bash
mkdir -p src/utils
```

Copy **validation.js** to `src/utils/validation.js`

### Step 5: Update ProtectedRoute

Option A: Replace existing file
```bash
cp PrivateRoute-improved.js src/components/auth/ProtectedRoute.js
```

Option B: Update manually
```javascript
// src/components/auth/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### Step 6: Update AuthContext

Option A: Replace with improved version
```javascript
// src/context/AuthContext.js
import React, { createContext, useContext } from 'react';
import useAuth from '../hooks/useAuth';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const auth = useAuth(); // Use the custom hook

  return (
    <AuthContext.Provider value={auth}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useAuthContext();

export default AuthContext;
```

Option B: Keep current context and import useAuth hook where needed

### Step 7: Update .env.local

Create or update `.env.local`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=197014643450-5gvp19crr5rsdkhuc2phfvb528cdh8e9.apps.googleusercontent.com
NODE_ENV=development
```

### Step 8: Update AuthPage.js

The current AuthPage.js needs minimal changes. Just update the API calls:

```javascript
// Update imports
import authService from '../services/authService';
import { validateLoginForm, validateRegistrationForm, validatePassword } from '../utils/validation';

// Update handleLogin to use authService
const handleLogin = async () => {
  setLoading(true);
  setError('');
  try {
    const data = await authService.login(formData.email, formData.password);
    login(data.token, { _id: data.user._id });
    setSuccess('Sign in successful! Redirecting...');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// Update handleSendOTP
const handleSendOTP = async () => {
  setLoading(true);
  setError('');
  setDevOtp('');
  try {
    const data = await authService.sendOTP(formData.email, mode === 'register' ? 'register' : 'reset');
    if (data.devOtp) {
      setDevOtp(data.devOtp);
    }
    setSuccess(`OTP sent to ${formData.email}`);
    setStep(2);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// Similar updates for other handlers...
```

### Step 9: Test Frontend

```bash
npm start
```

Test login at: http://localhost:3000/login

---

## Phase 3: Testing (10-15 minutes)

### Test 1: Backend Health Check
```bash
curl http://localhost:5000/health
```
Expected: `{"status":"OK",...}`

### Test 2: Send OTP (Postman)
```
POST http://localhost:5000/api/auth/send-otp
Body: { "email": "test@example.com", "type": "register" }
```
Expected: `devOtp` field in response

### Test 3: Register Flow
1. Go to frontend login page
2. Click "Sign Up"
3. Enter email
4. Copy OTP from console
5. Verify OTP
6. Set password
7. Should redirect to dashboard

### Test 4: Login Flow
1. Go to frontend login page
2. Enter email and password
3. Should redirect to dashboard

### Test 5: Protected Routes
1. Clear localStorage token
2. Try accessing `/dashboard`
3. Should redirect to `/login`

---

## Phase 4: Deployment Checklist

- [ ] Backend running and accepting requests
- [ ] Frontend can connect to backend API
- [ ] Login works end-to-end
- [ ] OTP generation and verification works
- [ ] Protected routes redirect appropriately
- [ ] Token stored in localStorage
- [ ] API errors display user-friendly messages
- [ ] Rate limiting active
- [ ] CORS allows frontend origin

---

## Troubleshooting

### Issue: "Cannot find module 'axios'"
```bash
npm install axios
```

### Issue: "CORS error"
Check:
1. Backend CORS config includes frontend URL
2. `FRONTEND_URL` in `.env`
3. Backend is running on correct port

### Issue: "Password validation failing"
Password must have:
- At least 8 characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- 1 special character

Example: `SecurePass123!`

### Issue: "OTP not showing in console"
1. Check `NODE_ENV=development` in `.env`
2. Check browser console (F12)
3. Check server console logs

### Issue: "Token invalid after reload"
1. Check token stored in localStorage
2. Check token expiry: `JWT_EXPIRY=24h`
3. Check same JWT_SECRET on backend

---

## File Summary

### New Files Created
- `src/services/api.js`
- `src/services/authService.js`
- `src/hooks/useAuth.js`
- `src/utils/validation.js`
- `src/components/auth/PrivateRoute-improved.js`
- `server/middleware/errorHandler.js`
- `server/middleware/validation.js`
- `server/middleware/rateLimiter.js`
- `server/middleware/verifyToken-improved.js`
- `server/routes/auth-improved.js`
- `server/server-improved.js`

### Files to Update
- `src/context/AuthContext.js` (optional)
- `src/pages/AuthPage.js`
- `server/server.js`
- `server/routes/auth.js`
- `server/.env`
- `.env.local`

### Files to Keep Unchanged
- `src/App.js` (keep existing routing)
- Integration components (EntrancePage, Authmodal, etc.)
- Existing features

---

## Next Steps

1. ✅ Create new service and hook files
2. ✅ Update backend middleware
3. ✅ Update auth routes
4. ✅ Update environment variables
5. ✅ Test authentication flows
6. ✅ Update any custom AuthPage implementations
7. ✅ Deploy to production with new JWT_SECRET

---

## Support & Debugging

Check these logs for errors:

**Backend:** 
```bash
npm run server:dev
```

**Frontend (Browser Console):**
```
F12 → Console tab
```

**Network Requests:**
```
F12 → Network tab → XHR
```

Look for:
- 401: Invalid token or credentials
- 429: Rate limited
- 400: Validation error
- 500: Server error

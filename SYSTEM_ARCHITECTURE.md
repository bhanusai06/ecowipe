# System Architecture & Data Flow

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          BROWSER (Client)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────┐          ┌──────────────────────────┐  │
│  │  React Components   │          │  Authentication Layer    │  │
│  │  - AuthPage         │          │  - useAuth Hook          │  │
│  │  - LoginForm        │◄─────────┤  - Services              │  │
│  │  - ProtectedRoute   │          │  - Validation Utils      │  │
│  └─────────────────────┘          └──────────────────────────┘  │
│               │                              ▲                    │
│               │ HTTP Requests                │                    │
│               │ (with axios)                 │                    │
│               ▼                              │                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         Axios Instance (api.js)                           │  │
│  │  - Request Interceptor (inject token)                    │  │
│  │  - Response Interceptor (check auth)                     │  │
│  │  - Timeout: 10 seconds                                    │  │
│  │  - Auto-retry on network error                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│               │                                                   │
│               │ Token stored in:                                 │
│               │ localStorage.setItem('auth-token', token)        │
│               │                                                   │
└───────────────┼───────────────────────────────────────────────────┘
                │
                │ HTTP/HTTPS
                │
┌───────────────┼───────────────────────────────────────────────────┐
│               ▼                                                     │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │         Backend Server (Express)                          │   │
│  │                                                            │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │  Request → Middleware Chain                      │    │   │
│  │  │  1. CORS check                                   │    │   │
│  │  │  2. Body parsing                                 │    │   │
│  │  │  3. Request logging (optional)                   │    │   │
│  │  │  4. Rate limiting (if applicable)                │    │   │
│  │  │  5. Input validation                             │    │   │
│  │  │  6. Token verification (if protected)            │    │   │
│  │  │  7. Route handler                                │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │                      ▼                                    │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │  Auth Routes                                     │    │   │
│  │  │  - POST /api/auth/send-otp                       │    │   │
│  │  │  - POST /api/auth/verify-otp                     │    │   │
│  │  │  - POST /api/auth/register                       │    │   │
│  │  │  - POST /api/auth/login                          │    │   │
│  │  │  - POST /api/auth/reset-password                 │    │   │
│  │  │  - POST /api/auth/google                         │    │   │
│  │  │  - GET /api/auth/me                              │    │   │
│  │  │  - POST /api/auth/logout                         │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │                      ▼                                    │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │  Business Logic                                  │    │   │
│  │  │  - Password hashing (bcryptjs)                   │    │   │
│  │  │  - JWT generation/verification                   │    │   │
│  │  │  - OTP generation/verification                   │    │   │
│  │  │  - Email sending                                 │    │   │
│  │  │  - Database operations                           │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │                      ▼                                    │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │  Response → Error Handler                        │    │   │
│  │  │  - Catch all errors                              │    │   │
│  │  │  - Format response                               │    │   │
│  │  │  - Set status code                               │    │   │
│  │  │  - Hide stack trace (production)                 │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │                                                            │   │
│  └───────────────────────────────────────────────────────────┘   │
│               │                                                   │
│               │                                                   │
│  ┌────────────┴──────────────────────────────────────────────┐  │
│  │         Database (MongoDB)                                 │  │
│  │  - User collection                                         │  │
│  │  - OTP storage (temp, 10 min expiry)                      │  │
│  │  - Session history (optional)                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow Sequences

### 1. Login Flow

```
User                 Frontend              Backend           Database
 │                      │                    │                  │
 │─── Enter Email ─────→ │                    │                  │
 │                       │                    │                  │
 │← Show Loading ────────│                    │                  │
 │                       │                    │                  │
 │                       │─ Validate Email ──→│                  │
 │                       │                    │                  │
 │                       │─ Check Rate Limit ─│                  │
 │                       │   (Max 5/15min)    │                  │
 │                       │                    │                  │
 │                       │─────────────────────────→ Find User   │
 │                       │                    │←─────────────────┤
 │                       │                    │                  │
 │                       │← Invalid ─────────→│ (400)            │
 │                       │  Email/Password    │                  │
 │                       │                    │                  │
 │← Show Error ──────────│                    │                  │
 │                       │                    │                  │
 │                       │─ Compare Password ─│ (bcrypt)         │
 │                       │                    │                  │
 │                       │← JWT Token ───────→│ (24h expiry)     │
 │                       │                    │                  │
 │← Redirect ────────────│ (store token)      │                  │
 │  to Dashboard         │ localStorage       │                  │
 │                       │ Fetch User Profile │                  │
 │                       │─────────────────────────→ Get User    │
 │                       │                    │←─────────────────┤
 │← Display Profile ─────│                    │                  │
```

### 2. Registration Flow (OTP-Based)

```
User                Frontend             Backend            Database    Email
 │                     │                   │                   │          │
 │─ Enter Email ──────→│                   │                   │          │
 │                     │                   │                   │          │
 │← Show Loading ──────│                   │                   │          │
 │                     │                   │                   │          │
 │                     │─ Check Rate Limit │ (Max 3/5min)     │          │
 │                     │                   │                   │          │
 │                     │─ Generate OTP ──→ │                   │          │
 │                     │                   │                   │          │
 │                     │─────────────────────────→ Save OTP    │          │
 │                     │                   │      (10 min)     │          │
 │                     │                   │                   │          │
 │                     │────────────────────────────────────────────→Send│
 │                     │                   │                   │       OTP│
 │                     │                   │                   │          │
 │← Show OTP Input─────│                   │                   │          │
 │                     │                   │                   │          │
 │─ Enter OTP ────────→│                   │                   │          │
 │                     │                   │                   │          │
 │                     │─ Verify OTP ─────→│                   │          │
 │                     │                   │                   │          │
 │                     │←─ Temp Token ─────│ (15 min expiry)   │          │
 │                     │   (return)        │                   │          │
 │                     │                   │                   │          │
 │← Show Password ─────│                   │                   │          │
 │  Input              │                   │                   │          │
 │                     │ (Show Strength    │                   │          │
 │─ Enter Password ───→│  Meter)           │                   │          │
 │                     │                   │                   │          │
 │                     │─ Validate ────────│ (8+ chars,        │          │
 │                     │ (Frontend)        │  uppercase,       │          │
 │                     │                   │  lowercase,       │          │
 │                     │                   │  number, special) │          │
 │                     │                   │                   │          │
 │← Show Full Name ────│                   │                   │          │
 │                     │                   │                   │          │
 │─ Enter Full Name ──→│                   │                   │          │
 │                     │                   │                   │          │
 │← Confirm ───────────│                   │                   │          │
 │                     │                   │                   │          │
 │─ Submit ───────────→│                   │                   │          │
 │                     │                   │                   │          │
 │                     │─ Register ──────→ │                   │          │
 │                     │ (with Temp Token) │                   │          │
 │                     │                   │                   │          │
 │                     │─ Verify Token ───→│ (valid scope)    │          │
 │                     │                   │                   │          │
 │                     │─ Hash Password ──→│ (bcryptjs)        │          │
 │                     │                   │                   │          │
 │                     │────────────────────────→ Create User  │          │
 │                     │                   │←──────────────────┤          │
 │                     │                   │                   │          │
 │                     │← JWT Token ───────│ (24h expiry)      │          │
 │                     │                   │                   │          │
 │← Redirect to ──────→│ (store token)     │                   │          │
 │  Dashboard          │ localStorage      │                   │          │
 │                     │ Fetch Profile     │                   │          │
 │                     │─────────────────────────→ Get User    │          │
 │                     │                   │←──────────────────┤          │
 │← Display Profile ───│                   │                   │          │
```

### 3. Protected Route Access

```
User              Frontend           Backend            Middleware
 │                    │                  │                  │
 │─ Access ──────────→│ /dashboard       │                  │
 │  Protected Route   │                  │                  │
 │                    │                  │                  │
 │                    │─ Check Token ────│                  │
 │                    │                  │                  │
 │                    │   ┌─ localStorage     Valid?      │
 │                    │   │  has token ?   ◄──────────────│
 │                    │   └─ Check Expiry    │              │
 │                    │                      │              │
 │                    │   ┌─ If Invalid ─────├─→Dispatch  │
 │                    │   │  dispatch event  │  'token-   │
 │                    │   └─ logout()        │   expired' │
 │                    │                      │              │
 │← Redirect to ──────│                  │                  │
 │  /login            │                  │                  │
 │                    │                  │                  │
 │                    │   ┌─ If Valid ───────────→         │
 │                    │   │  Include in Header              │
 │                    │   └─────┬──────────────             │
 │                    │         │                           │
 │                    │         │─ auth-token: JWT ────────→│
 │                    │         │                           │
 │                    │         │                    Verify│
 │                    │         │                  Token    │
 │                    │         │◄────────────────────────  │
 │                    │         │                           │
 │                    │    ┌───Return Data──────────────────│
 │                    │    │                                │
 │← Render ───────────│←──→│ req.user = { _id, ... }       │
 │  Dashboard         │    │                                │
```

---

## Error Handling Flow

```
Request
  │
  ▼
┌─────────────────────┐
│ CORS Validation     │
└─────────────────────┘
  │ ✓ Pass
  ▼
┌─────────────────────┐
│ Body Parsing        │
└─────────────────────┘
  │ ✓ Pass
  ▼
┌─────────────────────┐
│ Rate Limiting       │◄──── ❌ Too Many Attempts → 429
└─────────────────────┘
  │ ✓ Pass
  ▼
┌─────────────────────┐
│ Input Validation    │◄──── ❌ Invalid Input → 400 + Error Message
└─────────────────────┘
  │ ✓ Pass
  ▼
┌─────────────────────┐
│ Token Verification  │◄──── ❌ Invalid Token → 401
└─────────────────────┘
  │ ✓ Pass
  ▼
┌─────────────────────┐
│ Business Logic      │◄──── ❌ DB Error → 500 + Generic Message
│ (Database, etc)     │
└─────────────────────┘
  │ ✓ Pass
  ▼
┌─────────────────────┐
│ Response             │
│ (Success)           │
└─────────────────────┘
  │
  ▼
┌─────────────────────┐
│ Error Handler       │
│ (if error)          │◄──── Catch all errors
│ - Format error      │      Set status code
│ - Log (optional)    │      Hide stack trace (prod)
│ - Send response     │
└─────────────────────┘
```

---

## Token Lifecycle

```
┌─────────────────────────────────────────┐
│  Token Creation                         │
│  jwt.sign({ _id: user._id }, secret,   │
│            { expiresIn: '24h' })        │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Stored in localStorage                 │
│  localStorage.setItem('auth-token',     │
│    token)                               │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Attached to Requests                   │
│  Headers: { 'auth-token': token }       │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Verified on Backend                    │
│  jwt.verify(token, secret)              │
└─────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
     Valid              Expired/Invalid
        │                   │
        │                   ▼
        │         ┌──────────────────┐
        │         │ Return 401       │
        │         │ Dispatch event   │
        │         │ Auto-logout      │
        │         └──────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  Periodic Validation                    │
│  Every 5 minutes:                       │
│  - Check expiry locally                 │
│  - Auto-logout if expired               │
└─────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
    Valid              Expired
        │                   │
        │                   ▼
        │         ┌──────────────────┐
        │         │ Clear localStorage│
        │         │ Redirect to login │
        │         │ Show message      │
        │         └──────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  Token Expiry (24 hours)                │
│  Automatic logout required              │
│  User must re-login                     │
└─────────────────────────────────────────┘
```

---

## Rate Limiting Logic

```
┌──────────────────────┐
│ Request arrives      │
└──────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│ Get identifier:                      │
│ - IP address (for login)             │
│ - Email (for OTP)                    │
└──────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│ Check rate limiter:                  │
│ limiter.attempts[identifier] ?       │
└──────────────────────────────────────┘
        │
   ┌────┴────┐
   │         │
   ▼         ▼
 Found    Not Found
   │         │
   ▼         ▼
Check    Create entry:
Expiry   count: 1
   │      resetTime: now + window
   │         │
   ├─────────┘
   │
   ▼
┌──────────────────────────────────────┐
│ Is reset time passed?                │
└──────────────────────────────────────┘
   │
   ├─ Yes: Reset, allow request
   │
   └─ No: Increment count
          Check if > maxAttempts
          │
          ├─ Yes: Return 429
          │      "Too many attempts"
          │
          └─ No: Allow request
```

---

## Middleware Chain

```
                   Incoming Request
                        │
                        ▼
        ┌─────────────────────────────┐
        │ 1. Express Middleware       │
        │    - CORS                    │
        │    - Body Parser            │
        │    - Logging                 │
        └─────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────┐
        │ 2. Security Middleware      │
        │    - Rate Limiter           │
        │    - CORS Check             │
        │    - Authorization Check    │
        └─────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────┐
        │ 3. Validation Middleware    │
        │    - Input Validation       │
        │    - Sanitization           │
        │    - Type Checking          │
        └─────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────┐
        │ 4. Auth Middleware          │
        │    (if protected route)     │
        │    - Token Verification     │
        └─────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────┐
        │ 5. Route Handler            │
        │    - Business Logic         │
        │    - Database Operations    │
        └─────────────────────────────┘
                        │
        ┌───────────────┴────────────────┐
        │                                │
        ▼ (Success)                ▼ (Error)
    ┌─────────┐              ┌─────────────┐
    │Response │              │Error Handler│
    │ (200)   │              │ - Format    │
    └─────────┘              │ - Log       │
                             │ - Respond   │
                             └─────────────┘
                                    │
                                    ▼
                             ┌─────────────┐
                             │Client Error │
                             │ (400, 401,  │
                             │  429, 500)  │
                             └─────────────┘
```

---

## Data Flow for Protected Resources

```
Browser (Client)
       │
       │ (with auth-token in header)
       │
       ▼
Server Middleware Stack
       │
       ├─→ verifyToken middleware
       │       │
       │       ├─→ Read token from header
       │       │
       │       ├─→ jwt.verify() with secret
       │       │
       │       ├─ Success: Attach user to req
       │       │   req.user = { _id, email, ... }
       │       │
       │       └─ Failure: Return 401
       │
       ▼
Route Handler
       │
       ├─→ Access req.user._id
       │
       ├─→ Query database
       │   db.users.findById(req.user._id)
       │
       ├─→ Check permissions/role
       │
       ├─→ Perform action
       │
       ▼
Return Response
       │
       ├─ Success (200): Return data
       │
       └─ Error (400/500): Return error
```

---

## Security Boundaries

```
┌──────────────────────────────────────────────────────┐
│                   CLIENT (Browser)                   │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Frontend Validation:                                │
│  - Email format                                      │
│  - Password strength                                 │
│  - Required fields                                   │
│  - Input sanitization                                │
│                                                       │
│  Attack Surface:                                     │
│  ❌ Can be bypassed (client-side only)               │
│  ⚠️ XSS possible                                      │
│  ⚠️ Token visible in localStorage                    │
│                                                       │
│  Token Management:                                   │
│  - Stored in localStorage                            │
│  - Validated every 5 minutes                         │
│  - Auto-logout on expiry                             │
│                                                       │
└──────────────────────────────────────────────────────┘
         ▲                                    ▼
         │                                    │
      HTTP/HTTPS (encrypted in transit)      │
         │                                    │
         │                                    ▼
┌──────────────────────────────────────────────────────┐
│              BACKEND (Server)                        │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Request Validation:  (MUST PASS ALL)               │
│  - CORS check                                        │
│  - Rate limiting                                     │
│  - Input validation & sanitization                   │
│  - Type checking                                     │
│  - Token verification (if protected)                 │
│                                                       │
│  Attack Mitigations:                                 │
│  ✅ Rate limiting: 5/15min per IP                    │
│  ✅ Generic errors: No user enumeration              │
│  ✅ Strong passwords: 8+ chars + complexity          │
│  ✅ Hashing: bcryptjs with 10 rounds                │
│  ✅ Token expiry: 24 hours max                       │
│  ✅ Input sanitization: XSS prevention               │
│  ✅ CORS: Only allowed origins                       │
│                                                       │
│  Database (MongoDB):                                 │
│  - User documents encrypted at rest (optional)       │
│  - OTP deleted after verification                    │
│  - Audit logging (optional)                          │
│                                                       │
└──────────────────────────────────────────────────────┘
         ▲                                    ▼
         │                                    │
      Network (HTTPS enforced)                │
         │                                    │
         │                                    ▼
┌──────────────────────────────────────────────────────┐
│              DATABASE (MongoDB)                      │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Stored Data:                                        │
│  - Passwords: hashed (bcryptjs)                      │
│  - Tokens: in JWT (signed, not stored)               │
│  - OTP: temporary, expires 10 min                    │
│  - User email: indexed for quick lookup              │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

This architecture ensures layered security and proper data flow throughout the authentication system.

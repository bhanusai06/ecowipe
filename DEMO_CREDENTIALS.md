# 🔐 Demo Login Credentials & Testing Guide

## Quick Test Credentials

Since the app uses **OTP-based authentication**, use these test emails to demo the login flow:

### Test Email (for any testing)
```
Email: demo@test.com
Password: Demo@123456
```

### Alternative Test Emails
```
- testuser@example.com
- user@test.com
- demo.user@ecowipe.com
```

---

## How to Login/Register

### Step 1: Register New Account
1. Open the app
2. Click **"Sign Up"** or **"Register"**
3. Enter email: `demo@test.com`
4. Click **"Send OTP"**

### Step 2: Get the OTP
**In Development Mode** (NODE_ENV not set to 'production'):
- The OTP will appear in:
  - **Browser Console** (F12 → Console tab)
  - **Server Console** (terminal where server is running)
  - **Network Response** (Check the `/send-otp` response)

**Example OTP Response:**
```json
{
  "message": "OTP sent successfully",
  "devOtp": "654321"
}
```

### Step 3: Verify OTP
1. Copy the OTP from console
2. Paste it into the app's OTP field
3. Click **"Verify OTP"**

### Step 4: Set Password
1. Enter password: `Demo@123456`
2. Confirm password
3. Click **"Create Account"** or **"Register"**

### Step 5: Login
Now you can login with:
- **Email:** demo@test.com
- **Password:** Demo@123456

---

## Fastest Testing Method

To skip the OTP email step entirely:

### Option A: Check Browser Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Click "Sign Up"
4. Enter email: `demo@test.com`
5. Click "Send OTP"
6. In Network tab, find the `/send-otp` request
7. Click it → **Response** tab → Copy the `devOtp` value

### Option B: Check Server Console
When you click "Send OTP", the server logs:
```
DEBUG: Generated OTP for demo@test.com: 654321
```
Copy this number and use it.

---

## Pre-Seeded Demo Account (Optional)

If you want a pre-existing account without OTP registration:

### Setup Demo User in Database
Run MongoDB command:
```javascript
db.users.insertOne({
  email: "demo@test.com",
  password: "$2a$10$..." // bcrypt hash of "Demo@123456"
  full_name: "Demo User",
  isVerified: true,
  created_at: new Date(),
  eco_badges: [],
  total_eco_points: 0,
  total_devices_wiped: 0,
  total_data_wiped_gb: 0,
  role: "user"
})
```

Then login directly with:
- **Email:** demo@test.com
- **Password:** Demo@123456

---

## Environment Setup

Make sure `.env` has:
```
NODE_ENV=development  # NOT production (so OTP shows in response)
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| OTP not showing in response | Check `NODE_ENV` - it should NOT be 'production' |
| Can't find OTP | Open browser DevTools (F12) → Network tab → look for `/send-otp` |
| "User already exists" | Use a different email like `user2@test.com` |
| Can't login after registration | Check password case sensitivity |

---

## For Production

Once deployed to production:
- Set `NODE_ENV=production`
- OTP will only be sent via email
- Users must check their email for OTP (no console display)

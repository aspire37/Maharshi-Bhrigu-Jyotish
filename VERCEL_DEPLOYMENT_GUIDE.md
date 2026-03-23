# Vercel Deployment Guide - Maharshi Bhrigu Jyotish

## Overview

Your application has been restructured to be deployed on **Vercel** while maintaining full functionality. This guide provides step-by-step instructions for deployment.

---

## Architecture (Vercel Deployment)

```
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL DEPLOYMENT                           │
├──────────────────────────┬──────────────────────────────────────┤
│  Frontend (React/Vite)   │      Serverless API Functions       │
│  - Built React app       │  - /api/mail/send-custom-email      │
│  - Hosted on Vercel      │  - /api/mail/send-reschedule-email  │
│  - SPA routing configured│  - /api/health (status check)       │
└──────────────────────────┴──────────────────────────────────────┘
           │
           │ Uses (via REST API)
           ▼
   ┌───────────────────────┐
   │   Firebase Services   │
   │  ├─ Authentication    │
   │  ├─ Firestore DB      │
   │  └─ Cloud Functions*  │
   │     (for triggers)    │
   └───────────────────────┘
   
*Note: Firebase Functions remain for:
- Registration email trigger (auth.user().onCreate)
- Booking confirmation trigger (firestore.document.onCreate)
```

---

## What Changed?

### ✅ New Files Created:
- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to exclude from deployment
- `api/mail/send-custom-email.ts` - Custom email API endpoint
- `api/mail/send-reschedule-email.ts` - Reschedule email API endpoint
- `api/health.ts` - Health check endpoint

### ✅ Updated Files:
- `package.json` - Added required dependencies (firebase-admin, nodemailer, @vercel/node)
- `vite.config.ts` - Added Vercel app allowedHosts

### ✅ Still on Firebase Functions:
- Registration email (triggers on user creation)
- Booking confirmation email (triggers on payment document creation)
- Your Firebase config remains unchanged

---

## Deployment Steps

### Step 1: Install Dependencies
```bash
npm install
```

This will install new packages:
- `@vercel/node` - Vercel serverless runtime
- `firebase-admin` - Firebase Admin SDK for API functions
- `nodemailer` - Email sending library

### Step 2: Set Environment Variables on Vercel

Go to [Vercel Dashboard](https://vercel.com/dashboard) and add these environment variables to your project:

#### Firebase Configuration:
```
VITE_FIREBASE_API_KEY = AIzaSyCwK8ND28KoJ97aH-6kEmJqGmWYrOPO8hw
VITE_FIREBASE_AUTH_DOMAIN = maharashibhrigujyotish.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = maharashibhrigujyotish
VITE_FIREBASE_STORAGE_BUCKET = maharashibhrigujyotish.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 387515309952
VITE_FIREBASE_APP_ID = 1:387515309952:web:3f833ac0c1d81510abeb65
```

#### Email Configuration:
```
GMAIL_USER = maharshibhrigujyotish@gmail.com
GMAIL_PASSWORD = oheq dhse impf ygkw
ADMIN_EMAIL = maharshibhrigujyotish@gmail.com
```

#### Firebase Admin SDK (for API functions):
```
FIREBASE_CLIENT_EMAIL = (from Firebase service account key)
FIREBASE_PRIVATE_KEY = (from Firebase service account key)
```

**How to get Firebase Service Account Key:**
1. Go to Firebase Console → Project Settings
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. Copy `client_email` and `private_key` values
5. Add to Vercel environment variables

### Step 3: Connect GitHub Repository

```bash
# In your local repository
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

Then in Vercel Dashboard:
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Framework: Vercel detects automatically (Vite)
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click "Deploy"

### Step 4: Verify Deployment

Once deployed, test the following:

#### Test Frontend:
```
https://your-project.vercel.app/
```

#### Test Health Check Endpoint:
```
https://your-project.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-03-23T...",
  "environment": "production"
}
```

#### Test Email API (requires Authentication Token):
Use frontend to send custom email (once integrated)

---

## API Endpoints

All endpoints require **Firebase Authentication Token** in the Authorization header:

### 1. Send Custom Email
**POST** `/api/mail/send-custom-email`

**Headers:**
```
Authorization: Bearer {FIREBASE_ID_TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "user@example.com",
  "subject": "Email Subject",
  "html": "<h1>Email HTML Content</h1>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

---

### 2. Send Reschedule Email
**POST** `/api/mail/send-reschedule-email`

**Headers:**
```
Authorization: Bearer {FIREBASE_ID_TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "service": "Jyotish Reading",
  "oldDate": "March 25, 2024",
  "newDate": "March 30, 2024",
  "bookingId": "BOOKING_ID_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rescheduling emails sent successfully"
}
```

---

## Frontend Integration

To call the Vercel API endpoints from your React app, use this pattern:

```typescript
// Get Firebase ID token
const user = auth.currentUser;
const token = await user.getIdToken();

// Call Vercel API endpoint
const response = await fetch('/api/mail/send-custom-email', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: "recipient@example.com",
    subject: "Test Email",
    html: "<p>Test email body</p>"
  })
});

const result = await response.json();
console.log(result);
```

---

## Hybrid Architecture Benefits

✅ **Frontend on Vercel** - Fast global CDN, auto-scaling<br>
✅ **API Functions on Vercel** - Serverless, pay-per-use<br>
✅ **Firebase for Triggers** - Event-driven, auto-execute<br>
✅ **Unified Authentication** - Firebase Auth across all services<br>
✅ **Cost Effective** - Each component uses the best platform<br>

---

## Troubleshooting

### Issue: 401 Unauthorized on API calls
**Solution:** Ensure Firebase ID token is valid and passed in Authorization header

### Issue: Email not sending
**Check:**
1. Gmail credentials are correct
2. Gmail "Less secure apps" is enabled (or use App Password)
3. Environment variables are set on Vercel
4. No typos in recipient email

### Issue: Firestore triggers not working
**Note:** These are still on Firebase Functions - check Firebase Console for logs

### Issue: Build failure on Vercel
Check build logs:
1. Go to Vercel Dashboard → Project → Deployments
2. Click the failed deployment
3. Check "Build Logs" for errors

---

## Monitoring

### Monitor Vercel Functions:
- Vercel Dashboard → Functions
- Check logs and performance metrics

### Monitor Firebase Functions:
- Firebase Console → Functions
- View logs and metrics

### Monitor Errors:
- Set up error tracking (Sentry/LogRocket integration optional)

---

## Rolling Back

If deployment has issues:

```bash
# Rollback to previous deployment
# In Vercel Dashboard → Deployments
# Click the previous successful deployment → Click three dots → "Redeploy"
```

---

## Next Steps

1. ✅ Install dependencies locally: `npm install`
2. ✅ Test locally: `npm run dev`
3. ✅ Push to GitHub
4. ✅ Connect project in Vercel
5. ✅ Set environment variables
6. ✅ Deploy
7. ✅ Verify endpoints working
8. ✅ Update frontend to use new API endpoints (if needed)

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Nodemailer Docs:** https://nodemailer.com/

---

**Last Updated:** March 23, 2024<br>
**Status:** Ready for Vercel Deployment

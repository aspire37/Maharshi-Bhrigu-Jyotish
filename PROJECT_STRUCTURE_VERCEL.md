# Project Structure - Vercel Deployment Ready

## Updated Folder Structure

```
Maharshi-Bhrigu-Jyotish/
├── 📄 vercel.json                          ← NEW: Vercel configuration
├── 📄 .vercelignore                        ← NEW: Files to exclude from deployment
├── 📄 vite.config.ts                       ← UPDATED: Added Vercel allowedHosts
├── 📄 package.json                         ← UPDATED: Added Vercel/API dependencies
├── 📄 tsconfig.json                        
├── 📄 index.html                           
├── 📄 firebase.json                        
│
├── 📁 api/                                 ← NEW: Vercel Serverless Functions
│   ├── health.ts                           ← Health check endpoint
│   └── mail/                               ← Email endpoints
│       ├── send-custom-email.ts            ← Send custom HTML email
│       └── send-reschedule-email.ts        ← Send reschedule notification
│
├── 📁 src/
│   ├── App.tsx                             
│   ├── main.tsx
│   ├── firebase.ts                         
│   ├── index.css
│   ├── FAQ.txt
│   └── components/
│       └── FAQ.tsx
│
├── 📁 public/
│   └── (public assets)
│
├── 📁 functions/                           ← Still on Firebase (for triggers)
│   ├── src/
│   │   ├── index.ts                        ← Firebase Cloud Functions
│   │   └── emails.ts                       ← Email templates
│   └── lib/
│       ├── index.js
│       └── emails.js
│
├── 📄 VERCEL_DEPLOYMENT_GUIDE.md           ← NEW: Complete deployment guide
├── 📄 VERCEL_ENV_SETUP.md                  ← NEW: Environment variable setup
├── 📄 VERCEL_IMPLEMENTATION_SUMMARY.md     ← NEW: What was implemented
├── 📄 VERCEL_DEPLOYMENT_CHECKLIST.md       ← NEW: Step-by-step checklist
│
├── 📄 EMAIL_DOCUMENTATION_INDEX.md
├── 📄 EMAIL_IMPLEMENTATION_SUMMARY.md
├── 📄 EMAIL_QUICK_START.md
├── 📄 EMAIL_SETUP_GUIDE.md
├── 📄 EMAIL_SYSTEM_STRUCTURE.md
├── 📄 EMAIL_VERIFICATION_REPORT.md
├── 📄 START_HERE_EMAIL_SYSTEM.md
├── 📄 DEPLOYMENT_CHECKLIST.md
│
└── 📄 .env.local                           ← Your local configuration (don't commit)
```

## Key New Directories

### `/api` - Vercel Serverless Functions
```
api/
├── health.ts                              (Simple health check)
└── mail/
    ├── send-custom-email.ts               (POST endpoint for custom emails)
    └── send-reschedule-email.ts           (POST endpoint for reschedule emails)
```

**These functions:**
- Run on Vercel's serverless infrastructure
- Require Firebase authentication
- Use Nodemailer to send emails via Gmail
- Return JSON responses

## Updated Files Summary

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "devCommand": "vite --port 3000",
  "env": { /* Firebase & email config */ },
  "functions": { /* API functions config */ },
  "rewrites": [ /* SPA routing */ ]
}
```

### package.json (Updated Dependencies)
```json
{
  "dependencies": {
    "@vercel/node": "^3.0.0",           ← NEW
    "firebase-admin": "^12.0.0",        ← NEW
    "nodemailer": "^6.9.7",             ← NEW
    // ... existing deps
  }
}
```

### vite.config.ts (Updated)
```typescript
allowedHosts: [
  '*.vercel.app',                       ← NEW
  'maharshibhrigujyotish.onrender.com',
  'localhost',
  '127.0.0.1'
]
build: {                                 ← NEW
  outDir: 'dist',
  emptyOutDir: true,
}
```

## What Runs Where

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FRONTEND (React/Vite)        BACKEND API                   │
│  ├── App.tsx                  ├── /api/health               │
│  ├── components/              ├── /api/mail/                │
│  ├── firebase.ts              │   ├── send-custom-email     │
│  └── main.tsx                 │   └── send-reschedule-email │
│                               │                              │
│  Deployed to: Vercel CDN      Deployed to: Vercel Functions │
│  └── dist/                    └── Vercel edge network       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│         BACKEND SERVICES (Still on Firebase)                │
│  ├── Firebase Auth                                          │
│  ├── Firestore Database                                     │
│  ├── Cloud Functions for Events                             │
│  │   ├── sendRegistrationEmail (auth trigger)              │
│  │   ├── sendBookingConfirmationEmail (firestore trigger)  │
│  │   ├── sendCustomEmail (HTTP callable - deprecated)      │
│  │   └── sendRescheduleEmail (HTTP callable - deprecated)  │
│  └── Gmail Integration                                      │
│                                                              │
│  Deployed to: Google Firebase                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## File Purposes

| File | Purpose | New/Updated |
|------|---------|-----------|
| `vercel.json` | Vercel deployment config | 🆕 NEW |
| `.vercelignore` | Exclude files from deployment | 🆕 NEW |
| `api/health.ts` | Health check endpoint | 🆕 NEW |
| `api/mail/send-custom-email.ts` | Email API endpoint | 🆕 NEW |
| `api/mail/send-reschedule-email.ts` | Reschedule API endpoint | 🆕 NEW |
| `package.json` | Dependencies and scripts | 🔄 UPDATED |
| `vite.config.ts` | Build configuration | 🔄 UPDATED |
| `VERCEL_*.md` | Deployment documentation | 🆕 NEW (4 files) |

## Build Output

After `npm run build`:
```
dist/                          ← Served by Vercel
├── index.html                 ← Entry point
├── assets/
│   ├── main-xxxxx.js          ← React app
│   ├── index-xxxxx.css        ← Styles
│   └── ...                    ← Other assets
└── ...
```

## Environment Variables Location

**Local Development:**
```
.env.local  ← Not committed to git
```

**Vercel Production:**
```
Vercel Dashboard → Project Settings → Environment Variables
```

## Deployment Flow

```
1. Git Push
   │
   └─→ GitHub Repository
       │
       └─→ Vercel (auto-detected)
           ├─→ Install dependencies
           ├─→ Run: npm run build
           ├─→ Build React app → dist/
           ├─→ Analyze /api folder
           ├─→ Deploy to Vercel CDN
           └─→ Deploy API functions
               │
               └─→ Live at: https://your-project.vercel.app
```

## Quick Reference

### API Endpoints
```
POST /api/mail/send-custom-email
POST /api/mail/send-reschedule-email
GET  /api/health
```

### Build Commands
```bash
npm run build      # Build for production
npm run dev        # Dev with hot reload
npm run preview    # Preview production build
vercel            # Deploy via CLI
```

### Key Directories
- **Frontend code:** `src/`
- **API functions:** `api/`
- **Firebase functions:** `functions/`
- **Built app:** `dist/`

---

**Ready for Deployment**: ✅ YES

**Next Step**: Run `npm install` locally, then deploy to Vercel

See `VERCEL_DEPLOYMENT_CHECKLIST.md` for step-by-step instructions.

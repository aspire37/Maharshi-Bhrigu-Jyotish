# Environment Variables Setup for Vercel

## Quick Reference

Copy these variable names and set them in Vercel Dashboard:

### Step 1: Add in Vercel Project Settings → Environment Variables

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
GMAIL_USER
GMAIL_PASSWORD
ADMIN_EMAIL
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

## Values to Add

From your `.env.local`:

```
VITE_FIREBASE_API_KEY=AIzaSyCwK8ND28KoJ97aH-6kEmJqGmWYrOPO8hw
VITE_FIREBASE_AUTH_DOMAIN=maharashibhrigujyotish.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=maharashibhrigujyotish
VITE_FIREBASE_STORAGE_BUCKET=maharashibhrigujyotish.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=387515309952
VITE_FIREBASE_APP_ID=1:387515309952:web:3f833ac0c1d81510abeb65
GMAIL_USER=maharshibhrigujyotish@gmail.com
GMAIL_PASSWORD=oheq dhse impf ygkw
ADMIN_EMAIL=maharshibhrigujyotish@gmail.com
```

## Getting Firebase Service Account Key

1. Go to **Firebase Console** → Your Project
2. Click ⚙️ (Settings icon) → **Project Settings**
3. Go to **Service Accounts** tab
4. Click **Generate New Private Key** button
5. A JSON file downloads - open it and copy:

```json
{
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"
}
```

Then in Vercel, add:
```
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"
```

**Important:** For multi-line keys, use `\n` literally (don't paste with actual line breaks)

## Vercel Dashboard Steps

1. Go to https://vercel.com/dashboard
2. Click your project name
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar
5. Add each variable one by one
6. Click **Save**
7. Redeploy for changes to take effect (or wait for next push)

## Verify Setup

After deployment, test the health endpoint:
```
curl https://your-project.vercel.app/api/health
```

Should return:
```json
{"status":"ok","timestamp":"...","environment":"production"}
```

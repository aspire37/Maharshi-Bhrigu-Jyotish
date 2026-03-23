# Vercel Deployment Checklist

## Pre-Deployment Checklist

### Local Setup
- [ ] Run `npm install` to install new dependencies
- [ ] Run `npm run build` to verify build succeeds
- [ ] Run `npm run dev` to test locally
- [ ] Verify all features work in development
- [ ] Check that no sensitive data is in version control

### Git Setup
- [ ] Create a new branch or use main
- [ ] Commit all changes: `git add . && git commit -m "Prepare for Vercel deployment"`
- [ ] Push to GitHub: `git push origin main`

### Firebase Setup (for API functions)
- [ ] Go to Firebase Console
- [ ] Navigate to Project Settings ⚙️ → Service Accounts
- [ ] Click "Generate New Private Key"
- [ ] Download JSON file
- [ ] Copy `client_email` value
- [ ] Copy `private_key` value (including BEGIN/END markers)

### Vercel Account Setup
- [ ] Create account at https://vercel.com (if not already done)
- [ ] Connect your GitHub account to Vercel
- [ ] Authorize Vercel to access your repositories

---

## Deployment Steps

### Step 1: Create Project in Vercel
- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New..." → "Project"
- [ ] Select your GitHub repository
- [ ] Confirm project name

### Step 2: Configure Build Settings
- [ ] Framework: Should be auto-detected (Vite)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Click "Deploy" button

### Step 3: Add Environment Variables

Navigate to: **Project Settings** → **Environment Variables**

Add these 11 variables (copy values from your `.env.local` and Firebase):

```
VITE_FIREBASE_API_KEY = <copy from .env.local>
VITE_FIREBASE_AUTH_DOMAIN = <copy from .env.local>
VITE_FIREBASE_PROJECT_ID = <copy from .env.local>
VITE_FIREBASE_STORAGE_BUCKET = <copy from .env.local>
VITE_FIREBASE_MESSAGING_SENDER_ID = <copy from .env.local>
VITE_FIREBASE_APP_ID = <copy from .env.local>
GMAIL_USER = <copy from .env.local>
GMAIL_PASSWORD = <copy from .env.local>
ADMIN_EMAIL = <copy from .env.local>
FIREBASE_CLIENT_EMAIL = <from Firebase service account JSON>
FIREBASE_PRIVATE_KEY = <from Firebase service account JSON>
```

- [ ] All 11 environment variables added
- [ ] Variables are correct (no extra spaces or typos)
- [ ] Click "Save"

### Step 4: Redeploy with Environment Variables
- [ ] Go back to Deployments
- [ ] Click the circle icon on the latest deployment
- [ ] Click "Redeploy"
- [ ] Wait for deployment to complete

### Step 5: Verify Deployment

**Test Frontend:**
- [ ] Visit `https://your-project.vercel.app/`
- [ ] All pages load correctly
- [ ] No console errors

**Test Health Endpoint:**
```bash
curl https://your-project.vercel.app/api/health
```
Expected response:
```json
{"status":"ok","timestamp":"...","environment":"production"}
```
- [ ] Health endpoint returns 200 status
- [ ] Response contains `"status":"ok"`

**Test Email Functionality (Optional):**
- [ ] Create test user account
- [ ] Verify registration email works
- [ ] Create a test booking
- [ ] Verify confirmation email received (from Firebase trigger)

---

## Troubleshooting

### Build Failed
- [ ] Check Vercel build logs (Deployments → click failed deployment → View logs)
- [ ] Verify all dependencies are correct in package.json
- [ ] Try building locally: `npm run build`

### Health Endpoint Returns 500
- [ ] Check Vercel Function logs
- [ ] Verify environment variables are set correctly
- [ ] Check that FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY are correct

### Emails Not Sending
- [ ] Verify GMAIL_USER and GMAIL_PASSWORD are correct
- [ ] Check Gmail "Less secure apps" is enabled
- [ ] Try using App Password instead
- [ ] Check Firebase Function logs for registration/booking emails

### API Returns 401 Unauthorized
- [ ] Verify Firebase ID token is being sent in Frontend
- [ ] Check token is valid and not expired
- [ ] Ensure Authorization header format is correct: `Bearer {token}`

### Page Not Found (404)
- [ ] Verify vercel.json routing is correct
- [ ] Check that `dist/` folder is being served
- [ ] Verify build completed successfully

---

## Post-Deployment

### Monitoring
- [ ] Check Vercel Dashboard regularly for error rates
- [ ] Monitor Vercel Functions performance
- [ ] Check Firebase Console for any issues
- [ ] Set up error notifications (optional)

### Maintenance
- [ ] Keep dependencies updated
- [ ] Monitor Firebase usage and costs
- [ ] Review Vercel analytics monthly

### Documentation
- [ ] Share deployment URL with team
- [ ] Update README with Vercel URL
- [ ] Document any custom configuration

---

## Rollback (if needed)

If something goes wrong:

1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click the three-dot menu ⋮
4. Click "Redeploy"
5. Wait for redeployment to complete

---

## Success Checklist

- [ ] Frontend loads at `https://your-project.vercel.app/`
- [ ] No console errors on page load
- [ ] All routes work (SPA navigation)
- [ ] Health endpoint responds: `https://your-project.vercel.app/api/health`
- [ ] Firebase Auth login/signup works
- [ ] New user registration emails received
- [ ] Booking confirmation emails received
- [ ] No errors in Vercel or Firebase logs

---

## Contact & Support

- **Vercel Support**: https://vercel.com/help
- **Firebase Support**: https://firebase.google.com/support
- **Documentation**: See VERCEL_DEPLOYMENT_GUIDE.md

---

## Additional Resources

- Vercel Documentation: https://vercel.com/docs
- Firebase Admin SDK: https://firebase.google.com/docs/admin/setup
- Nodemailer Guide: https://nodemailer.com/about/
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs (for future reference)

---

**Last Updated**: March 23, 2024  
**Status**: Ready for Deployment  
**Estimated Time**: 15-30 minutes

---

## Quick Command Reference

```bash
# Local testing
npm install
npm run dev
npm run build

# Git push
git add .
git commit -m "Prepare for Vercel"
git push origin main

# Vercel CLI (optional)
npm install -g vercel
vercel           # Deploy from command line
vercel --prod    # Deploy to production
```

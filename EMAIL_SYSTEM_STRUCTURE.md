# 📁 Email System - Complete File Structure

## Project Directory Structure (After Setup)

```
Maharshi-Bhrigu-Jyotish/
├── src/
│   ├── App.tsx                    (Main app with bookings)
│   ├── firebase.ts                (Firebase init with Firestore)
│   ├── main.tsx
│   └── index.css
│
├── public/
│   └── banner.jpg
│
├── functions/                     ✨ NEW - Cloud Functions Directory
│   ├── src/
│   │   ├── emails.ts             ✨ Email templates & sending logic
│   │   │   ├── sendEmail()                      (Main sending function)
│   │   ├── getRegistrationEmailTemplate()       (Welcome email)
│   │   ├── getBookingConfirmationEmailTemplate() (User confirmation)
│   │   └── getAdminBookingNotificationTemplate() (Admin notification)
│   │
│   │   └── index.ts              ✨ Cloud Functions triggers
│   │       ├── sendRegistrationEmail()          (Auth trigger)
│   │       ├── sendBookingConfirmationEmail()   (Firestore trigger)
│   │       ├── sendCustomEmail()                (Callable function)
│   │       └── sendRescheduleEmail()            (Callable function)
│   │
│   ├── lib/                       (Compiled JavaScript - auto-generated)
│   │   ├── emails.js
│   │   └── index.js
│   │
│   ├── .env.local                 ✨ UPDATE WITH YOUR CREDENTIALS
│   │   ├── GMAIL_USER
│   │   ├── GMAIL_PASSWORD         (Your 16-char App Password)
│   │   ├── ADMIN_EMAIL
│   │   ├── APP_URL
│   │   └── FIREBASE_URL
│   │
│   ├── .gitignore                 (Excludes node_modules, .env, lib/)
│   ├── package.json               (Dependencies: firebase-admin, firebase-functions, nodemailer)
│   ├── tsconfig.json              (TypeScript configuration)
│   └── node_modules/              (After npm install)
│
├── EMAIL_SETUP_GUIDE.md           ✨ Detailed setup instructions
├── EMAIL_QUICK_START.md           ✨ Quick reference checklist
├── .env.local                     (Main app Firebase config)
├── vite.config.ts
├── tsconfig.json
├── package.json
└── firebase.json                  (Firebase CLI config)
```

---

## 🔧 Added Dependencies (in functions/package.json)

```json
{
  "dependencies": {
    "firebase-admin": "^12.0.0",      // Firebase Admin SDK
    "firebase-functions": "^4.5.0",   // Cloud Functions SDK
    "nodemailer": "^6.9.7"            // Email sending library
  }
}
```

---

## 🚀 Cloud Functions Deployed

### Function 1: `sendRegistrationEmail`
```typescript
Trigger: Firebase Authentication - User Creation
Purpose:  Send welcome email to new users
Runs on:  When user signs up with email/password or Google
Sends to: User's email address
```

### Function 2: `sendBookingConfirmationEmail`
```typescript
Trigger: Firestore - Document Create (payments collection)
Purpose:  Send booking confirmations
Runs on:  When new booking created in 'payments' collection
Sends to: User email + Admin email
```

### Function 3: `sendCustomEmail`
```typescript
Trigger: Callable HTTP Function
Purpose:  Send custom emails from app
Runs on:  When called from frontend/backend
Sends to: Specified email address
```

### Function 4: `sendRescheduleEmail`
```typescript
Trigger: Callable HTTP Function
Purpose:  Send rescheduling notifications
Runs on:  When user reschedules a booking
Sends to: User email + Admin email
```

---

## 📊 Email Queue Flow

```
User Action
    ↓
Firebase Trigger Fires
    ↓
sendEmail() function executes
    ↓
Nodemailer sends via Gmail SMTP
    ↓
Email delivered to recipient inbox
    ↓
Logs recorded in Firebase Console
```

---

## 🔒 Environment Variables

### `functions/.env.local`
```env
GMAIL_USER=maharshibhrigujyotish@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx          # YOUR APP PASSWORD (16 chars)
ADMIN_EMAIL=maharshibhrigujyotish@gmail.com
APP_URL=https://maharshi-bhrigu-jyotish.web.app
FIREBASE_URL=https://maharashibhrigujyotish.firebaseapp.com
```

**⚠️ NEVER commit this file to Git - it's in .gitignore**

---

## 📮 Email Templates

### Template 1: Registration (User -> New Account)
- File: `functions/src/emails.ts` - `getRegistrationEmailTemplate()`
- Recipient: User email
- Content: Welcome, account confirmation, next steps
- Status: ✅ Implemented

### Template 2: Booking Confirmation (User -> After Payment)
- File: `functions/src/emails.ts` - `getBookingConfirmationEmailTemplate()`
- Recipient: User email
- Content: Booking details, session info, support contact
- Status: ✅ Implemented

### Template 3: Admin Notification (Admin -> New Booking)
- File: `functions/src/emails.ts` - `getAdminBookingNotificationTemplate()`
- Recipient: maharshibhrigujyotish@gmail.com
- Content: Customer info, action items, admin panel link
- Status: ✅ Implemented

### Template 4: Reschedule Notification
- File: `functions/src/index.ts` - `sendRescheduleEmail()`
- Recipients: User + Admin
- Content: Old date, new date, action required
- Status: ✅ Implemented

---

## 🎯 Email Triggers

| Event | Function | Delay | Recipient |
|-------|----------|-------|-----------|
| User signs up | `sendRegistrationEmail` | 0-5 sec | User |
| Booking created | `sendBookingConfirmationEmail` | 0-5 sec | User + Admin |
| User reschedules | `sendRescheduleEmail` | 0-5 sec | User + Admin |
| Manual call | `sendCustomEmail` | 0-5 sec | Specified |

---

## 🧪 Testing Workflow

```
1. User clicks "Login" or "Sign Up"
2. Completes registration
3. Firebase Auth trigger fires
4. sendRegistrationEmail() executes
5. Nodemailer sends welcome email
6. Firebase logs success/failure

---

1. User clicks "Book Session"
2. Selects service and date
3. Completes payment
4. savePaymentData() stores to Firestore
5. Firestore trigger fires
6. sendBookingConfirmationEmail() executes
7. Sends 2 emails:
   - User confirmation
   - Admin notification
8. Firebase logs both sends
```

---

## 🔍 Debugging & Monitoring

### View Logs in Firefox Console
1. Open Firebase Console
2. Go to **Functions** tab
3. Click function name (e.g., `sendBookingConfirmationEmail`)
4. Go to **Logs** tab
5. Filter by date/time

### Expected Log Output
```
Email sent successfully: message-id@gmail.com
[Info] Welcome email sent to: user@example.com
[Info] Admin notification email sent
```

---

## 🚨 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Authentication failed" | Wrong Gmail password | Use App Password, not regular password |
| "Function not triggered" | Function not deployed | Run: firebase deploy --only functions |
| "Email not sent" | Firestore rule issue | Check 'payments' collection is writable |
| "Connection timeout" | Network issue | Check internet, retry deployment |
| "Rate limit exceeded" | Too many emails | Gmail limits ~30/min, wait and retry |

---

## ✅ Verification Checklist

- [ ] `functions/` directory created
- [ ] `src/emails.ts` and `src/index.ts` created
- [ ] `functions/.env.local` updated with credentials
- [ ] `npm install` completed in functions/
- [ ] `npm run build` successful (lib/ folder created)
- [ ] `firebase deploy --only functions` successful
- [ ] Functions visible in Firebase Console
- [ ] Test registration email received
- [ ] Test booking email received (user)
- [ ] Test booking email received (admin)

---

## 📞 Next Steps

1. ✅ Complete Firebase deployment steps (see EMAIL_QUICK_START.md)
2. ✅ Test with a registration
3. ✅ Test with a booking payment
4. ✅ Verify emails received in inbox
5. ✅ Monitor Firebase Console logs

**All files are ready - just need credentials and deployment!** 🚀

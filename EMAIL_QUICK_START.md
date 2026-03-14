# 📧 Email Setup - Quick Checklist

## ✅ What's Been Created

- [x] **Cloud Functions Structure** - Complete Firebase Cloud Functions setup
- [x] **Email Templates** - Professional HTML email templates with branding
- [x] **Automatic Triggers**:
  - User registration → Welcome email
  - Booking creation → Confirmation + Admin notification
  - Reschedule → Update emails
- [x] **Configuration Files** - .env.local setup for Gmail authentication
- [x] **Complete Documentation** - Setup guide included

---

## 🎯 Your Action Items

### **IMMEDIATELY (Required for emails to work)**

#### 1️⃣ Get Gmail App Password (5 minutes)
```
1. Open https://myaccount.google.com/apppasswords
2. Sign in with: maharshibhrigujyotish@gmail.com
3. Select App: Mail | Device: Windows Computer
4. Click Generate
5. Copy the 16-character password
```

#### 2️⃣ Update Environment Variables (1 minute)
Edit `functions/.env.local`:
```env
GMAIL_USER=maharshibhrigujyotish@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx  ← YOUR APP PASSWORD HERE
ADMIN_EMAIL=maharshibhrigujyotish@gmail.com
APP_URL=https://maharshi-bhrigu-jyotish.web.app
FIREBASE_URL=https://maharashibhrigujyotish.firebaseapp.com
```

#### 3️⃣ Install Dependencies (2 minutes)
```powershell
cd functions
npm install
```

#### 4️⃣ Build Functions (1 minute)
```powershell
npm run build
```

#### 5️⃣ Deploy to Firebase (2 minutes)
From project root:
```powershell
firebase deploy --only functions
```

---

## 📬 What Emails Will Be Sent

### **1. Registration Confirmation**
- **Trigger:** When user creates account via email
- **Sent to:** User's email
- **Time:** Immediately
- **Content:** Welcome message, account confirmation, next steps

### **2. Booking Confirmation (USER)**
- **Trigger:** When user completes booking payment
- **Sent to:** User's email
- **Time:** Within 30 seconds
- **Content:** Booking details, session info, support contact, WhatsApp link

### **3. Booking Notification (ADMIN)**
- **Trigger:** When user completes booking payment
- **Sent to:** maharshibhrigujyotish@gmail.com
- **Time:** Within 30 seconds
- **Content:** Customer details, action items checklist, admin panel link

---

## 🧪 Testing the Setup

### **Test 1: User Registration**
1. Test register a new user
2. Check their email inbox for welcome email
3. Verify email looks correct with branding

### **Test 2: Booking Confirmation**
1. Complete a test booking with payment
2. Check user's email for confirmation
3. Check admin email (maharshibhrigujyotish@gmail.com) for notification

### **Test 3: View Logs**
1. Go to Firebase Console
2. Click **Functions** tab
3. Click each function to see execution logs

---

## 🚀 Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| Get Gmail App Password | 5 min | ⏳ PENDING |
| Update `.env.local` | 1 min | ⏳ PENDING |
| Install dependencies | 2 min | ⏳ PENDING |
| Build functions | 1 min | ⏳ PENDING |
| Deploy to Firebase | 2 min | ⏳ PENDING |
| **Total Time** | **~11 min** | **🚀 Ready!** |

---

## 📁 Created Files/Directories

```
functions/
├── src/
│   ├── emails.ts          (Email templates & sending logic)
│   └── index.ts           (Cloud Functions triggers)
├── .env.local             (⚠️ UPDATE WITH YOUR CREDENTIALS)
├── .gitignore             (Prevents committing sensitive files)
├── package.json           (Dependencies)
└── tsconfig.json          (TypeScript config)

Root Directory:
└── EMAIL_SETUP_GUIDE.md   (Complete setup documentation)
```

---

## 🔐 Important Notes

⚠️ **SECURITY:**
- `functions/.env.local` contains sensitive credentials
- It's already in `.gitignore` - don't remove it
- Never commit email passwords to Git
- Use App Passwords only (not your main Gmail password)

---

## ✨ Email Features

✅ **Professional Templates** with:
- Gradient headers (Spiritual gold & maroon branding)
- Responsive design (works on all devices)
- Clear call-to-action buttons
- Customer & admin specific content
- WhatsApp integration links

✅ **Automatic Triggers** for:
- User registration
- Booking creation
- Rescheduling

✅ **Error Handling**:
- Graceful failures (booking succeeds even if email fails)
- Detailed logging in Firebase Console
- Retry logic for transient failures

---

## 📞 Support

If emails aren't sending:

1. **Check Gmail credentials:**
   - Verify 2FA is enabled
   - Verify App Password is correct (not regular password)
   - Check `functions/.env.local`

2. **Check Firebase logs:**
   - Firebase Console → Functions → Logs
   - Look for error messages

3. **Verify Firestore rules:**
   - Ensure 'payments' collection is writable
   - Check if user is authenticated

---

## 🎉 Once Deployed

Your system will automatically:
✅ Welcome new users with registration confirmation
✅ Celebrate bookings with user confirmations  
✅ Alert admin of new bookings with action items
✅ Log all email activity in Firebase Console
✅ Handle errors gracefully without disrupting bookings

---

**Next Step:** Complete the 5 action items above to deploy emails! 🚀

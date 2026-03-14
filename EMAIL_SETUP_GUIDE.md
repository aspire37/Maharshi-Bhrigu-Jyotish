# Email Notification Setup Guide - Maharshi Bhrigu Jyotish

## 📧 Overview

This guide explains how to set up automated email notifications for:
1. **User Registration Confirmation** - Sent when a new user creates an account
2. **Booking Confirmation** - Sent to user when they complete a booking payment
3. **Admin Booking Notification** - Sent to admin with booking details

---

## 🔧 Setup Steps

### **Step 1: Get Gmail App Password**

1. Go to [Google Account Security](https://myaccount.google.com/apppasswords)
2. Sign in with the Gmail account: `maharshibhrigujyotish@gmail.com`
3. Select **App**: Mail
4. Select **Device**: Windows Computer (or your OS)
5. Click **Generate**
6. You'll see a 16-character password - **copy this**
7. Add it to `functions/.env.local`:
   ```
   GMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

**⚠️ IMPORTANT:** 
- Two-Factor Authentication must be enabled on your Google account
- This password is DIFFERENT from your regular Gmail password
- Keep it secure and never share it

---

### **Step 2: Install Cloud Functions CLI**

```powershell
npm install -g firebase-tools
firebase login
```

---

### **Step 3: Initialize Cloud Functions (if not already done)**

From your project root:

```powershell
firebase init functions
```

When prompted:
- **Language**: TypeScript
- **ESLint**: Yes (optional but recommended)
- **Install dependencies**: Yes

---

### **Step 4: Install Dependencies**

Navigate to the functions directory and install:

```powershell
cd functions
npm install
```

This installs:
- `firebase-admin` - Firebase Admin SDK
- `firebase-functions` - Cloud Functions SDK
- `nodemailer` - Email sending library

---

### **Step 5: Set Environment Variables**

Update `functions/.env.local` with your credentials:

```env
GMAIL_USER=maharshibhrigujyotish@gmail.com
GMAIL_PASSWORD=your_16_char_app_password
ADMIN_EMAIL=maharshibhrigujyotish@gmail.com
APP_URL=https://maharshi-bhrigu-jyotish.web.app
FIREBASE_URL=https://maharashibhrigujyotish.firebaseapp.com
```

---

### **Step 6: Build Functions**

```powershell
cd functions
npm run build
```

This compiles TypeScript to JavaScript in the `lib/` folder.

---

### **Step 7: Deploy Cloud Functions**

```powershell
firebase deploy --only functions
```

The deployment will show:
- `sendRegistrationEmail` → Triggers on user registration
- `sendBookingConfirmationEmail` → Triggers on new booking (payment)
- `sendCustomEmail` → Callable function for custom emails
- `sendRescheduleEmail` → Callable function for rescheduling

---

### **Step 8: Verify Deployment**

Check Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `maharashibhrigujyotish` project
3. Go to **Functions** tab
4. You should see all 4 functions listed with ✅ status

---

## 📮 Email Flows

### **Flow 1: User Registration** 📝
```
User Signs Up
    ↓
Firebase Auth triggers sendRegistrationEmail()
    ↓
Welcome email sent to user with:
  - Account confirmation
  - Instructions to book a session
  - Security tips
  - Next steps
```

### **Flow 2: Booking Confirmation** 🎫
```
User Completes Payment
    ↓
Payment saved to Firestore 'payments' collection
    ↓
sendBookingConfirmationEmail() triggered
    ↓
Two emails sent:
  1. To USER: Booking confirmation with details
  2. To ADMIN: Notification with action items
```

### **Flow 3: Manual Email (Optional)** 📧
```
Admin or App calls sendCustomEmail()
    ↓
Email sent to specified recipient
    ↓
Used for follow-ups, updates, etc.
```

---

## 📋 Email Templates

### **Registration Email**
- ✅ Welcome message
- 📝 Account details
- 📺 Service overview
- 🔗 Dashboard link
- 🔒 Security notice

### **User Booking Confirmation**
- ✅ Booking confirmation
- 📋 Session details (service, date, amount, payment method)
- ⏭️ What happens next
- ⚠️ Support contact info
- 📱 WhatsApp link for reschedules

### **Admin Booking Notification**
- 🔔 Customer information
- 💰 Payment details
- 📋 Action items checklist
- ⚠️ Reminder to respond within 24 hours
- 🔗 Admin panel link

---

## 🧪 Testing Emails Locally

To test Cloud Functions locally:

```powershell
cd functions
npm run serve
```

This starts the Firebase Emulator Suite. You can then:
1. Trigger user registration in the app
2. Create a test booking
3. Check emulator logs for email sending confirmation

---

## 🚨 Troubleshooting

### "Email sending failed"
- ✅ Check Gmail account credentials
- ✅ Verify App Password is correct
- ✅ Ensure 2FA is enabled on Gmail account
- ✅ Check Firebase Cloud Functions logs for errors

### "Functions not triggering"
- ✅ Verify functions are deployed: `firebase deploy --only functions`
- ✅ Check if Firestore rules allow writes to 'payments' collection
- ✅ Monitor Firebase Console → Functions → Logs tab

### "Rate limiting errors"
- ✅ Gmail limits ~30 emails per minute
- ✅ If you hit limit, wait 1 minute before retrying
- ✅ For high volume, consider SendGrid or Mailgun

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use App Passwords only** - Not your main Gmail password
3. **Rotate credentials regularly** - Change App Password every 6 months
4. **Monitor email logs** - Check Fire base Console for suspicious activity
5. **Implement rate limiting** - Prevent spam emails from users

---

## 📊 Monitoring & Logs

View email sending logs in Firebase Console:

1. Go to **Functions** tab
2. Click on `sendBookingConfirmationEmail` function
3. Go to **Logs** tab
4. Filter by date/time to see email delivery status

---

## 🎯 Future Enhancements

You can extend email functionality with:
- **SMS notifications** - Integrate Twilio for SMS alerts
- **Email templates** - Use Handlebars for dynamic templates
- **Send Grid integration** - For higher email volume
- **Email scheduling** - Send reminders before sessions
- **Custom branding** - Add logos and branded themes

---

## 📞 Support

If you encounter issues:

1. Check Firebase Cloud Functions logs
2. Review environment variables in `functions/.env.local`
3. Verify Gmail App Password is correct
4. Ensure Firestore rules allow collection access

---

**✅ Setup Complete!**

Your email notification system is now ready to send:
- 📧 Registration confirmations
- 🎫 Booking confirmations (to user AND admin)
- 📱 Support updates via WhatsApp

# 🧪 COMPREHENSIVE TESTING GUIDE

## Pre-Testing Setup

```bash
# 1. Install dependencies
npm install

# 2. Verify TypeScript compilation
npm run lint

# 3. Start development server
npm run dev
```

Server should be running at `http://localhost:3000`

---

## ✅ Test 1: Input Validation

### Test Email Validation
- [ ] Open Login modal
- [ ] Try `invalidemail` (no @) → Should show error
- [ ] Try `test@` (incomplete) → Should show error
- [ ] Try `test@example.com` (valid) → Should show no error

### Test Password Validation
- [ ] Try password `123` (too short) → Error: "at least 6 characters"
- [ ] Try password `123456` (valid) → No error
- [ ] Leave password empty → Error on submit

### Test Form Submission
1. Fill email: `test@example.com`
2. Fill password: `password123`
3. Click Login
4. Should either:
   - ✅ Login successfully (if account exists)
   - ✅ Show Firebase error (account doesn't exist)

### Test Password Confirmation (Signup)
- [ ] Type password `test123`
- [ ] Type confirmation `test456` (different)
- [ ] Click Sign Up → Error: "Passwords do not match"
- [ ] Make them match → Should proceed

---

## ✅ Test 2: Components Separation

### Verify Component Files Exist
```bash
# Check these files exist:
ls src/components/Navigation.tsx          # ✅ Should exist
ls src/components/BookingCalendar.tsx     # ✅ Should exist
ls src/components/AdminDashboard.tsx      # ✅ Should exist
ls src/components/modals/AuthModal.tsx    # ✅ Should exist
```

### Test Navigation Component
1. **Open app** → Navigation should display
2. **Logo/branding** → Should be visible
3. **Menu links** (Home, Services, About, Contact) → Should scroll sections
4. **Mobile menu** (screen < 768px) → Hamburger icon appears
5. **Login button** → Opens auth modal
6. **Language switcher** → Shows "EN" or "मराठी"

### Test AuthModal Component
1. **Click Login** → AuthModal opens
2. **Form appears** → Email and password fields visible
3. **Google button** → Present with Google icon
4. **Toggle signup** → Form updates to signup mode
5. **Close button (X)** → Modal closes

---

## ✅ Test 3: Reschedule Functionality

### Prerequisites
- Must be logged in
- Must have at least one booking

### Test Reschedule Flow
1. **Click "My Bookings"** in Navigation
2. **MyBookingsModal opens** → Shows existing bookings
3. **Click "Reschedule"** on a booking
4. **RescheduleModal opens** → Shows current date
5. **Select new date** → Date picker appears
6. **Click "Confirm"** → Booking updates in Firestore
7. **Verify change** → "My Bookings" shows updated date

### Test Error Cases
- [ ] Select past date → Error: "future date"
- [ ] Try reschedule while offline → Error message
- [ ] Click Cancel → Modal closes without saving

---

## ✅ Test 4: Accessibility

### Keyboard Navigation
1. **Tab key** - Cycle through link, buttons, inputs
   - [ ] Can reach all interactive elements
   - [ ] Focus visible (border or outline)
   
2. **Enter key** - Activate buttons
   - [ ] Login button works
   - [ ] Reschedule confirm works
   
3. **Escape key** - Close modals
   - [ ] AuthModal closes
   - [ ] Booking modal closes
   - [ ] Calendar closes

### Screen Reader Testing (NVDA/JAWS)
```bash
# Text to appear for screen readers:
<button aria-label="Close modal">
  <X />  <!-- Icon hidden from screen reader with aria-hidden -->
</button>
```

[ ] Test with free NVDA (Windows) or Voiceover (Mac)
[ ] Navigation reads correctly
[ ] Form labels announce
[ ] Errors announce as alerts
[ ] Button purposes clear

### Color Contrast
- Use https://webaim.org/resources/contrastchecker/
- [ ] Gold (#D4AF37) on white → Pass (ratio > 4.5:1)
- [ ] White on maroon → Pass
- [ ] Gray text on white → Pass

### Touch Targets (Mobile)
- [ ] Buttons at least 48px × 48px
- [ ] Input fields adequate size
- [ ] Links clickable (not tiny)

### Visual Testing
inspect HTML:
```html
<!-- Good - semantic button -->
<button onclick="handleClick">Close</button>

<!-- Bad - div acting as button -->
<div onclick="handleClick">Close</div>
```
[ ] Verify semantic HTML used (button, input, form)

---

## ✅ Test 5: Admin Dashboard

### Access Admin Dashboard
1. **Login with any account**
2. **Click "Admin"** in Navigation
3. **AdminDashboard renders** → Should show:
   - [ ] Overview tab with stats
   - [ ] Bookings tab with table
   - [ ] Settings tab

### Test Stats Calculation
1. **Go to Overview tab**
2. **Verify numbers:**
   - [ ] Total Bookings = count of all payments
   - [ ] Completed = count with status "Completed"
   - [ ] Pending = count with status "Pending"
   - [ ] Revenue = sum of completed booking amounts

### Test Bookings Table
1. **Go to Bookings tab**
2. **Table displays all bookings** with columns:
   - [ ] Client name
   - [ ] Service
   - [ ] Booking date
   - [ ] Amount
   - [ ] Status (colored badge)

3. **Test sorting:**
   - [ ] Click "By Date" → Sort by newest first
   - [ ] Click "By Amount" → Sort by highest amount first
   - [ ] Verify order changes

### Test Logout
1. **In Admin, click Logout**
2. **Redirected to main site**
3. **"Admin" button gone from nav**

---

## ✅ Test 6: Multi-Language Support

### Test Language Switching
1. **Click language button** (top nav, shows "EN" or "मराठी")
2. **Dropdown appears** with options:
   - [ ] English
   - [ ] मराठी

3. **Select English:**
   - [ ] All text changes to English
   - [ ] Button shows "มराठी"
   - [ ] Page reloads with English text

4. **Select Marathi:**
   - [ ] All text changes to Marathi
   - [ ] Button shows "EN"
   - [ ] Page reloads with Marathi text

### Test Persistence
1. **Set language to English**
2. **Reload page** (F5 or Ctrl+R)
3. **Should still be English** (saved in localStorage)

4. **Clear localStorage:**
   ```javascript
   localStorage.clear()
   ```
5. **Reload** → Should default to Marathi

### Test Translation Completeness
- [ ] All form labels translated
- [ ] All button text translated
- [ ] All error messages translated
- [ ] Navigation menu translated
- [ ] Hero section translated
- [ ] All sections have both languages

Check browser console for any i18n errors:
```javascript
// Press F12 → Console tab
// Should have no red errors about missing translations
```

---

## ✅ Test 7: Booking Calendar

### Display Calendar
1. **Have at least one booking**
2. **Calendar should show:**
   - [ ] Month name and year
   - [ ] Days of week (Sun-Sat)
   - [ ] Calendar grid
   - [ ] Navigation arrows (previous/next month)

### Test Date Selection
1. **Click on a future date**
   - [ ] Date highlights
   - [ ] Shows bookings for that date

2. **Try clicking past date**
   - [ ] Past dates disabled (greyed out, no click)

3. **Click next bookings:**
   - [ ] Same service can't be booked same day (validation)

### Navigation
1. **Click right arrow** → Next month displays
2. **Click left arrow** → Previous month displays
3. **Navigate 12 months** → Should work without errors

### Booking Display
1. **Select date with bookings**
2. **Below calendar shows:**
   - [ ] Booking service name
   - [ ] Client name
   - [ ] Amount (₹999)
   - [ ] Status (Completed/Pending)

---

## 🔧 Debugging Checklist

If something isn't working, check:

### Network Tab (F12 → Network)
- [ ] No 404 errors
- [ ] No CORS errors
- [ ] Firebase requests successful (green 200)

### Console Tab (F12 → Console)
- [ ] No red error messages
- [ ] No TypeScript/JavaScript errors
- [ ] i18n warnings are okay if silent

### Application Tab (F12 → Application)
- [ ] localStorage shows language setting
- [ ] Firebase config loaded
- [ ] Cookies present (if using)

### Lighthouse (F12 → Lighthouse)
Run audit:
```
Performance: > 80
Accessibility: > 90
Best Practices: > 85
SEO: > 80
```

---

## 📱 Responsive Testing

### Mobile (375px - iPhone SE)
- [ ] Navigation menu works
- [ ] Buttons clickable
- [ ] Forms readable
- [ ] Calendar fits screen
- [ ] No horizontal scroll

### Tablet (768px - iPad)
- [ ] Layout adapts
- [ ] Grid shows 2 columns
- [ ] Navigation uses columns

### Desktop (1920px)
- [ ] Full layout
- [ ] Grid shows 3+ columns
- [ ] Hover effects work

**Test in Chrome DevTools:**
```
Ctrl+Shift+M (Mac: Cmd+Shift+M) → Toggle device toolbar
```

---

## 🌐 Cross-Browser Testing

Test in:
- [ ] Chrome/Edge (V115+)
- [ ] Firefox (V115+)
- [ ] Safari (V17+)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## 📊 Performance Testing

Open DevTools (F12) → Performance tab:

1. **Click Record**
2. **Perform action** (e.g., open booking modal)
3. **Click Stop**
4. **Check metrics:**
   - [ ] Largest Contentful Paint (LCP) < 2500ms
   - [ ] Cumulative Layout Shift (CLS) < 0.1
   - [ ] Time to Interactive < 3500ms

---

## ✨ Final Verification Checklist

Before deployment, verify:

### Code Quality
- [ ] Run `npm run lint` - No errors
- [ ] Run `npm run build` - Successful build
- [ ] Check console (F12) - No errors

### Features
- [ ] All 7 features working
- [ ] Forms validate input
- [ ] Components display
- [ ] Admin dashboard works
- [ ] Calendar functional
- [ ] Reschedule works
- [ ] Languages switch

### Accessibility
- [ ] Tab navigation complete
- [ ] Screen reader test passed
- [ ] Color contrast good
- [ ] Touch targets adequate

### Performance
- [ ] Lighthouse score > 85
- [ ] No network errors
- [ ] No console errors
- [ ] Components load quickly

### Cross-Browser
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works
- [ ] Mobile browser works

---

## 🚀 Deployment Readiness

When ready to deploy:

```bash
# 1. Final build
npm run build

# 2. Verify build success
# Check dist/ folder exists with files

# 3. Deploy to Vercel
vercel deploy --prod

# 4. Test production site
curl https://your-domain.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": "production"
}
```

---

## 📞 Troubleshooting

### Issue: "Module not found"
```bash
npm install
rm -rf node_modules
npm install
```

### Issue: Firebase errors
- Verify credentials in `.env.local`
- Check Firebase console for project
- Ensure API keys not restricted

### Issue: Translation not working
- Check `src/i18n/config.ts` imported in `main.tsx`
- Verify JSON files valid (no syntax errors)
- Check browser console for i18n warnings

### Issue: Modal won't close
- Check `onClose` prop passed
- Verify state management correct
- Check z-index conflicts

### Issue:Styles not loading
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild (`npm run build`)
- Check Tailwind CSS installed

---

## ✅ Sign-off Checklist

- [ ] All features implemented
- [ ] All tests passing
- [ ] Accessibility verified
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Ready for deployment


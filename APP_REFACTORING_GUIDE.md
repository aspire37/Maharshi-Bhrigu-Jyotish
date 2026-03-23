# App.tsx Refactoring Guide

## Overview
This guide shows how to update your existing App.tsx to use all the new components, hooks, and features.

## Key Changes

### 1. Update Imports
Replace the current imports with:

```tsx
import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, Eye, Heart, Wind, Moon, Sun, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

// New hooks
import { useAuth, useBookings, useVideos } from './hooks';

// New components
import { Navigation } from './components/Navigation';
import { AuthModal } from './components/modals/AuthModal';
import { MyBookingsModal } from './components/modals/MyBookingsModal';
import { RescheduleModal } from './components/modals/RescheduleModal';
import { BookingCalendar } from './components/BookingCalendar';
import { AdminDashboard } from './components/AdminDashboard';
import FAQComponent from './components/FAQ';

// Constants
import { SERVICES, BOOKING_AMOUNT_INR } from './constants';

// Firebase
import { auth, db } from './firebase';
```

### 2. Replace useState with Custom Hooks

**BEFORE:**
```tsx
const [user, setUser] = useState<FirebaseUser | null>(null);
const [error, setError] = useState('');
const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  return () => unsubscribe();
}, []);
```

**AFTER:**
```tsx
const { user, loading: authLoading, error: authError, setError: setAuthError, loginWithEmail, signupWithEmail, loginWithGoogle, logout } = useAuth();
const { bookings: userBookings, loading: bookingLoading, savePaymentData, fetchUserBookings, checkDuplicateBooking, rescheduleBooking, cancelBooking } = useBookings();
const { featuredVideos, loading: videoLoading } = useVideos();

const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
```

### 3. Simplify State Management

**BEFORE:**
```tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [paymentMethod, setPaymentMethod] = useState<'gpay' | 'phonepe'>('gpay');
const [paymentDone, setPaymentDone] = useState(false);
const [selectedService, setSelectedService] = useState('');
const [preferredDate, setPreferredDate] = useState('');
const [additionalNotes, setAdditionalNotes] = useState('');
const [userBookings, setUserBookings] = useState<any[]>([]);
const [loadingBookings, setLoadingBookings] = useState(false);
// ... more states
```

**AFTER:**
```tsx
const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
const [isMyBookingsModalOpen, setIsMyBookingsModalOpen] = useState(false);
const [isAdminView, setIsAdminView] = useState(false);
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [scrolled, setScrolled] = useState(false);

// Booking form state
const [selectedService, setSelectedService] = useState('');
const [preferredDate, setPreferredDate] = useState('');
const [additionalNotes, setAdditionalNotes] = useState('');
const [paymentMethod, setPaymentMethod] = useState<'gpay' | 'phonepe'>('gpay');
const [paymentDone, setPaymentDone] = useState(false);
const [bookingError, setBookingError] = useState('');

// Reschedule modal state
const [selectedBooking, setSelectedBooking] = useState<Payment | null>(null);
const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
```

### 4. Update Main Component Structure

```tsx
export default function App() {
  const { t } = useTranslation();
  const { user, logout: authLogout, error: authError } = useAuth();
  
  // ... state management ...

  // Handle authentication
  const handleEmailAuth = async (email: string, password: string, isSignup: boolean) => {
    try {
      if (isSignup) {
        await signupWithEmail(email, password, 'User');
      } else {
        await loginWithEmail(email, password);
      }
      setIsLoginModalOpen(false);
    } catch (err) {
      setAuthError(String(err));
    }
  };

  const handleLogout = async () => {
    await authLogout();
    setIsAdminView(false);
  };

  // Handle booking
  const handleSaveBooking = async () => {
    if (!selectedService || !preferredDate || !user) {
      setBookingError('Please fill all fields');
      return;
    }

    try {
      const isDuplicate = await checkDuplicateBooking(
        user.uid,
        selectedService,
        preferredDate
      );

      if (isDuplicate) {
        setBookingError('You already have a booking for this date');
        return;
      }

      await savePaymentData({
        userId: user.uid,
        userName: user.displayName || 'User',
        userEmail: user.email || '',
        service: selectedService,
        bookingDate: preferredDate,
        amount: BOOKING_AMOUNT_INR,
        paymentMethod,
        paymentStatus: 'Pending',
        transactionDate: new Date().toISOString(),
        additionalNotes,
      });

      setPaymentDone(true);
    } catch (err: any) {
      setBookingError(err.message);
    }
  };

  // Render
  return (
    <div className="min-h-screen selection:bg-spiritual-gold selection:text-white">
      {/* Navigation */}
      <Navigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrolled={scrolled}
        user={user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onAdminClick={() => setIsAdminView(true)}
      />

      {/* Admin View */}
      {isAdminView && user ? (
        <AdminDashboard
          bookings={userBookings}
          onLogout={() => {
            setIsAdminView(false);
            handleLogout();
          }}
        />
      ) : (
        <>
          {/* Hero, Services, About sections... */}
          {/* Keep existing JSX structure */}

          {/* Modals */}
          <AuthModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginEmail={async (email, password) => {
              await loginWithEmail(email, password);
            }}
            onSignupEmail={async (email, password, name) => {
              await signupWithEmail(email, password);
            }}
            onLoginGoogle={loginWithGoogle}
            isLoading={authLoading}
            error={authError}
          />

          {user && (
            <MyBookingsModal
              isOpen={isMyBookingsModalOpen}
              onClose={() => setIsMyBookingsModalOpen(false)}
              userId={user.uid}
              onFetchBookings={fetchUserBookings}
              onReschedule={rescheduleBooking}
              onCancel={cancelBooking}
            />
          )}

          <RescheduleModal
            isOpen={isRescheduleModalOpen}
            onClose={() => {
              setIsRescheduleModalOpen(false);
              setSelectedBooking(null);
            }}
            booking={selectedBooking}
            onReschedule={rescheduleBooking}
            isLoading={bookingLoading}
          />

          {/* Booking Calendar - optional display */}
          {user && userBookings.length > 0 && (
            <BookingCalendar
              bookings={userBookings}
              selectedDate={preferredDate}
              onDateSelect={setPreferredDate}
            />
          )}

          {/* Footer */}
        </>
      )}
    </div>
  );
}
```

### 5. Update Existing Handlers

```tsx
// For booking modal
const handleBookingClick = async () => {
  if (!user) {
    setIsLoginModalOpen(true);
    return;
  }
  setIsBookingModalOpen(true);
};

// For my bookings
const handleMyBookingsClick = async () => {
  if (!user) {
    setIsLoginModalOpen(true);
    return;
  }

  try {
    const bookings = await fetchUserBookings(user.uid);
    setUserBookings(bookings); // or use local state if needed
    setIsMyBookingsModalOpen(true);
  } catch (err) {
    console.error('Failed to fetch bookings:', err);
  }
};

// Handle reschedule from modal
const handleRescheduleClick = (booking: Payment) => {
  setSelectedBooking(booking);
  setIsRescheduleModalOpen(true);
};
```

### 6. Update useEffect for Scroll

```tsx
useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 50);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

## Migration Steps

1. **Backup current App.tsx** - Create `App.old.tsx` copy
2. **Update imports** - Add all new imports at the top
3. **Replace state** - Use custom hooks instead of useState
4. **Update handlers** - Refactor auth/booking handlers
5. **Replace components** - Use extracted Navigation component
6. **Replace modals** - Use new modals (AuthModal, MyBookingsModal, etc.)
7. **Test each section** - Form validation, auth, bookings
8. **Run npm install** - To install new dependencies
9. **Test full flow** - Login, booking, reschedule, admin

## Testing Recommendations

```bash
# After updating App.tsx:
npm install          # Install new dependencies
npm run dev          # Start development server
```

Then test:
- [ ] Navigation works
- [ ] Login/Signup with validation
- [ ] Form validation shows errors
- [ ] Booking creation
- [ ] Admin dashboard access
- [ ] Language switching
- [ ] Reschedule functionality
- [ ] Mobile responsiveness
- [ ] Accessibility (Tab navigation, ARIA)


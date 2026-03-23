import { useState, useCallback } from 'react';
import { 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  updateDoc,
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Payment } from '../types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const savePaymentData = useCallback(
    async (paymentData: Omit<Payment, 'id' | 'createdAt'>): Promise<string> => {
      try {
        setError('');
        setLoading(true);

        const docRef = await addDoc(collection(db, 'payments'), {
          ...paymentData,
          createdAt: Timestamp.now(),
        });

        return docRef.id;
      } catch (err: any) {
        const message = ERROR_MESSAGES.BOOKING_FAILED;
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchUserBookings = useCallback(
    async (userId: string): Promise<Payment[]> => {
      try {
        setError('');
        setLoading(true);

        const q = query(
          collection(db, 'payments'),
          where('userId', '==', userId),
          orderBy('bookingDate', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const bookings: Payment[] = [];

        querySnapshot.forEach((doc) => {
          bookings.push({
            id: doc.id,
            ...doc.data(),
          } as Payment);
        });

        return bookings;
      } catch (err: any) {
        const message = ERROR_MESSAGES.FIRESTORE_ERROR;
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const checkDuplicateBooking = useCallback(
    async (userId: string, service: string, date: string): Promise<boolean> => {
      try {
        const q = query(
          collection(db, 'payments'),
          where('userId', '==', userId),
          where('service', '==', service),
          where('bookingDate', '==', date)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.size > 0;
      } catch (err: any) {
        console.error('Error checking duplicate booking:', err);
        return false;
      }
    },
    []
  );

  const rescheduleBooking = useCallback(
    async (bookingId: string, newDate: string): Promise<void> => {
      try {
        setError('');
        setLoading(true);

        const bookingRef = doc(db, 'payments', bookingId);
        await updateDoc(bookingRef, {
          bookingDate: newDate,
        });
      } catch (err: any) {
        const message = 'Failed to reschedule booking. Please try again.';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const cancelBooking = useCallback(
    async (bookingId: string): Promise<void> => {
      try {
        setError('');
        setLoading(true);

        const bookingRef = doc(db, 'payments', bookingId);
        await updateDoc(bookingRef, {
          paymentStatus: 'Cancelled',
        });
      } catch (err: any) {
        const message = 'Failed to cancel booking. Please try again.';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    setError,
    savePaymentData,
    fetchUserBookings,
    checkDuplicateBooking,
    rescheduleBooking,
    cancelBooking,
  };
};

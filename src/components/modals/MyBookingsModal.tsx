import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, AlertCircle, Loader } from 'lucide-react';
import { Payment } from '../../types';
import { RescheduleModal } from './RescheduleModal';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onFetchBookings: (userId: string) => Promise<Payment[]>;
  onReschedule: (bookingId: string, newDate: string) => Promise<void>;
  onCancel: (bookingId: string) => Promise<void>;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  userId,
  onFetchBookings,
  onReschedule,
  onCancel,
}) => {
  const [bookings, setBookings] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Payment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchBookings();
    }
  }, [isOpen, userId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await onFetchBookings(userId);
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = (booking: Payment) => {
    setSelectedBooking(booking);
    setRescheduleModal(true);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this booking? Refund policy applies.'
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await onCancel(bookingId);
      await fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleSubmit = async (bookingId: string, newDate: string) => {
    try {
      setActionLoading(true);
      await onReschedule(bookingId, newDate);
      await fetchBookings();
    } catch (err: any) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="spiritual-gradient p-10 text-white flex justify-between items-center sticky top-0">
                <div>
                  <h2 className="text-3xl font-serif mb-2">My Bookings</h2>
                  <p className="text-white/60 text-sm">
                    View and manage your booked sessions
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader className="w-8 h-8 animate-spin text-spiritual-gold mx-auto mb-2" />
                      <p className="text-gray-600">Loading your bookings...</p>
                    </div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-600 mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start by booking one of our sacred sessions
                    </p>
                    <button
                      onClick={onClose}
                      className="bg-spiritual-maroon text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
                    >
                      Book a Session
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white p-6 rounded-2xl border-2 transition-all ${
                          booking.paymentStatus === 'Completed'
                            ? 'border-green-200 bg-green-50/30'
                            : booking.paymentStatus === 'Pending'
                              ? 'border-yellow-200 bg-yellow-50/30'
                              : 'border-gray-200'
                        }`}
                      >
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                              Service
                            </p>
                            <p className="text-lg font-bold text-spiritual-ink">
                              {booking.service}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                              Booking Date
                            </p>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-spiritual-gold" />
                              <p className="font-bold text-spiritual-ink">
                                {new Date(booking.bookingDate).toLocaleDateString(
                                  'en-IN',
                                  {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-4 pb-4 border-t border-gray-200">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                              Amount
                            </p>
                            <p className="text-xl font-bold text-spiritual-gold">
                              ₹{booking.amount}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                              Status
                            </p>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                                booking.paymentStatus === 'Completed'
                                  ? 'bg-green-100 text-green-700'
                                  : booking.paymentStatus === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {booking.paymentStatus !== 'Cancelled' && (
                          <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleReschedule(booking)}
                              disabled={actionLoading}
                              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold hover:bg-gray-300 transition-all disabled:opacity-50"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={actionLoading}
                              className="flex-1 bg-red-50 text-red-700 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-all disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={rescheduleModal}
        onClose={() => {
          setRescheduleModal(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onReschedule={handleRescheduleSubmit}
        isLoading={actionLoading}
      />
    </>
  );
};

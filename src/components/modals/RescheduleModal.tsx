import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { Payment } from '../../types';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Payment | null;
  onReschedule: (bookingId: string, newDate: string) => Promise<void>;
  isLoading: boolean;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  booking,
  onReschedule,
  isLoading,
}) => {
  const [newDate, setNewDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newDate) {
      setError('Please select a date');
      return;
    }

    if (new Date(newDate) <= new Date()) {
      setError('Please select a future date');
      return;
    }

    try {
      if (booking) {
        await onReschedule(booking.id, newDate);
        setNewDate('');
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reschedule booking');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && booking && (
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
            className="relative bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="spiritual-gradient p-10 text-white text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-spiritual-gold" />
              <h2 className="text-3xl font-serif mb-2">Reschedule Session</h2>
              <p className="text-white/60 text-sm">
                Book a new date for {booking.service}
              </p>
            </div>

            <div className="p-10">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-2">
                    Current Booking
                  </p>
                  <div className="bg-spiritual-cream p-4 rounded-lg border border-gray-200">
                    <p className="font-bold text-spiritual-ink">
                      {booking.service}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Select New Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-spiritual-gold outline-none text-sm"
                      aria-label="New booking date"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-spiritual-maroon text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Rescheduling...' : 'Confirm'}
                  </button>
                </div>
              </form>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

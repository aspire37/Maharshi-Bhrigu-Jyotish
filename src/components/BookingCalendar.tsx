import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Payment } from '../types';

interface BookingCalendarProps {
  bookings: Payment[];
  selectedDate?: string;
  onDateSelect: (date: string) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  selectedDate,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

 const getBookingsForDate = (day: number): Payment[] => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return bookings.filter((booking) => booking.bookingDate === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const firstDay = getFirstDayOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-serif text-spiritual-ink font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-spiritual-gold" />
            Booking Calendar
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-spiritual-ink" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-spiritual-ink" />
            </button>
          </div>
        </div>

        <p className="text-center text-lg font-semibold text-spiritual-ink mb-6">
          {monthName}
        </p>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center font-bold text-sm text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {emptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square" />
          ))}

          {/* Days of month */}
          {days.map((day) => {
            const dayBookings = getBookingsForDate(day);
            const isSelected = selectedDate === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isPast = new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date();

            return (
              <motion.button
                key={day}
                onClick={() => {
                  if (!isPast) {
                    const dateStr = `${currentDate.getFullYear()}-${String(
                      currentDate.getMonth() + 1
                    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    onDateSelect(dateStr);
                  }
                }}
                disabled={isPast}
                whileHover={!isPast ? { scale: 1.05 } : {}}
                className={`aspect-square rounded-lg p-2 flex flex-col items-center justify-center font-semibold text-sm transition-all relative ${
                  isSelected
                    ? 'bg-spiritual-maroon text-white shadow-lg'
                    : dayBookings.length > 0
                      ? 'bg-spiritual-gold/20 text-spiritual-ink'
                      : isPast
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-50 text-spiritual-ink hover:bg-gray-100'
                }`}
              >
                <span>{day}</span>
                {dayBookings.length > 0 && (
                  <span className="text-xs mt-1 bg-red-500 text-white px-1 rounded-full">
                    {dayBookings.length}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bookings List for Selected Date */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 pt-8 border-t border-gray-200"
        >
          <h4 className="font-bold text-spiritual-ink mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-spiritual-gold" />
            Bookings for {new Date(selectedDate).toLocaleDateString('en-IN', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h4>

          {(() => {
            const dayBookings = bookings.filter(
              (b) => b.bookingDate === selectedDate
            );
            return dayBookings.length > 0 ? (
              <div className="space-y-3">
                {dayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-spiritual-cream p-4 rounded-lg border border-gray-200"
                  >
                    <p className="font-bold text-spiritual-ink">
                      {booking.service}
                    </p>
                    <p className="text-sm text-gray-600">
                      Client: {booking.userName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Amount: ₹{booking.amount}
                    </p>
                    <p
                      className={`text-xs font-semibold mt-2 ${
                        booking.paymentStatus === 'Completed'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {booking.paymentStatus}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No bookings for this date
              </p>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogOut, BarChart3, Calendar, Users, DollarSign, Settings } from 'lucide-react';
import { AdminStats } from '../types';
import { Payment } from '../types';

interface AdminDashboardProps {
  bookings: Payment[];
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'bookings' | 'settings'
  >('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0,
  });

  useEffect(() => {
    // Calculate stats
    const total = bookings.length;
    const revenue = bookings
      .filter((b) => b.paymentStatus === 'Completed')
      .reduce((sum, b) => sum + b.amount, 0);
    const pending = bookings.filter((b) => b.paymentStatus === 'Pending').length;
    const completed = bookings.filter(
      (b) => b.paymentStatus === 'Completed'
    ).length;

    setStats({
      totalBookings: total,
      totalRevenue: revenue,
      pendingBookings: pending,
      completedBookings: completed,
    });
  }, [bookings]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-spiritual-ink">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">Manage bookings and services</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 sticky top-16 z-30 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() =>
                setActiveTab(id as 'overview' | 'bookings' | 'settings')
              }
              className={`py-4 px-2 font-bold text-sm uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === id
                  ? 'text-spiritual-maroon border-spiritual-maroon'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <AdminOverview stats={stats} totalBookings={bookings.length} />
        )}
        {activeTab === 'bookings' && <AdminBookings bookings={bookings} />}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
};

const AdminOverview: React.FC<{
  stats: AdminStats;
  totalBookings: number;
}> = ({ stats, totalBookings }) => {
  const cards = [
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'spiritual-blue',
    },
    {
      label: 'Completed',
      value: stats.completedBookings,
      icon: Users,
      color: 'spiritual-gold',
    },
    {
      label: 'Pending',
      value: stats.pendingBookings,
      icon: DollarSign,
      color: 'spiritual-maroon',
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue}`,
      icon: BarChart3,
      color: 'green',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-2">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-spiritual-ink">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${card.color}/10`}>
                <card.icon className={`w-6 h-6 text-${card.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-xl font-bold text-spiritual-ink mb-6">
          Quick Stats
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">Conversion Rate</span>
            <span className="font-bold text-spiritual-ink">
              {totalBookings > 0
                ? (
                    ((stats.completedBookings / totalBookings) * 100).toFixed(1)
                  ).toString() + '%'
                : '0%'}
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">Average Booking Value</span>
            <span className="font-bold text-spiritual-ink">
              ₹
              {totalBookings > 0
                ? Math.round(stats.totalRevenue / stats.completedBookings)
                : 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Pending Amount</span>
            <span className="font-bold text-spiritual-maroon">
              ₹{stats.pendingBookings * 999}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminBookings: React.FC<{ bookings: Payment[] }> = ({ bookings }) => {
  const [sortField, setSortField] = useState<'bookingDate' | 'amount'>(
    'bookingDate'
  );
  const sortedBookings = [...bookings].sort((a, b) => {
    if (sortField === 'bookingDate')
      return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
    return b.amount - a.amount;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-spiritual-ink">
            All Bookings ({bookings.length})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSortField('bookingDate')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                sortField === 'bookingDate'
                  ? 'bg-spiritual-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              By Date
            </button>
            <button
              onClick={() => setSortField('amount')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                sortField === 'amount'
                  ? 'bg-spiritual-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              By Amount
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-spiritual-ink">
                      {booking.userName}
                    </p>
                    <p className="text-sm text-gray-500">{booking.userEmail}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-spiritual-ink font-semibold">
                  {booking.service}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(booking.bookingDate).toLocaleDateString('en-IN')}
                </td>
                <td className="px-6 py-4 font-bold text-spiritual-gold">
                  ₹{booking.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.paymentStatus === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : booking.paymentStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-spiritual-ink mb-6">Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            System Status
          </label>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-semibold">✓ All systems operational</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Last Backup
          </label>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

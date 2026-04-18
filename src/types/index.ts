import React from 'react';

export interface Service {
  title: string;
  titleMr: string;
  description: string;
  icon: string;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  service: string;
  bookingDate: string;
  amount: number;
  paymentMethod: 'gpay' | 'phonepe';
  paymentStatus: 'Completed' | 'Pending' | 'Failed';
  transactionDate: string;
  additionalNotes?: string;
  createdAt?: string;
}

export interface Video {
  id: string;
  title: string;
  thumb: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface FormValidationError {
  field: string;
  message: string;
}

export interface BookingFormData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  selectedService: string;
  preferredDate: string;
  additionalNotes?: string;
}

export interface AdminStats {
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  completedBookings: number;
}

export interface Booking {
  id: string;
  userId: string;
  service: string;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'gemstones' | 'books' | 'spiritual-items' | 'merchandise' | 'gift-sets';
  images: string[];
  stock: number;
  sku: string;
  weight?: string;
  dimensions?: string;
  benefits?: string[];
  createdAt?: string;
  featured?: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  applicableServices?: string[];
  applicableProducts?: string[];
  minOrderAmount?: number;
  createdAt?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  appliedPromoCode?: string;
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

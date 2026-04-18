import { z } from 'zod';

export interface Service {
  title: string;
  titleMr: string;
  description: string;
  icon: string;
}

// Validation Schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters');
export const phoneSchema = z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const bookingSchema = z.object({
  selectedService: z.string().min(1, 'Please select a service'),
  preferredDate: z.string().refine(
    (date) => new Date(date) > new Date(),
    'Please select a future date'
  ),
  additionalNotes: z.string().optional(),
});

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Constants
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '+919158058080';
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'maharshibhrigujyotish@gmail.com';
export const BOOKING_AMOUNT_INR = 999;
export const VIDEO_CACHE_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
export const VIDEO_CACHE_CHECK_INTERVAL = 60 * 1000; // 1 minute
export const FEATURED_VIDEOS_COUNT = 4;
export const VIDEOS_PER_GRID = 3;
export const POOL_VERSION = '1.3';

export const SERVICES: Service[] = [
  {
    title: "Vedic Astrology",
    titleMr: "वैदिक ज्योतिष",
    description: "Traditional Vedic principles for accurate life predictions and guidance.",
    icon: "sun",
  },
  {
    title: "Crystal Healing",
    titleMr: "क्रिस्टल हीलिंग",
    description: "Using sacred crystals to balance energy and promote spiritual well-being.",
    icon: "sparkles",
  },
  {
    title: "Kundali Analysis",
    titleMr: "कुंडली विश्लेषण",
    description: "In-depth analysis of the 12 houses of your birth chart.",
    icon: "moon",
  },
  {
    title: "Vastu Shastra",
    titleMr: "वास्तु शास्त्र",
    description: "Harmonizing your home and office energy for prosperity.",
    icon: "compass",
  },
  {
    title: "Meditation",
    titleMr: "ध्यान",
    description: "Techniques for mental peace and energy balancing.",
    icon: "wind",
  },
  {
    title: "Spiritual Healing",
    titleMr: "आध्यात्मिक उपचार",
    description: "Energy healing and spiritual remedies for life's challenges.",
    icon: "heart",
  },
  {
    title: "Past Life Regression",
    titleMr: "भूतकाळ जीवन प्रतिगमन",
    description: "Exploring past life connections and karmic patterns.",
    icon: "eye",
  }
];

export const YOUTUBE_VIDEO_POOL = [
  { id: 'lOLOpXxEEzQ', title: 'पाडव्याच्या मुहूर्तावरच का कोसळायचं संकट? किरणच्या ३ पूर्वजन्मांची सत्यकथा!' },
  { id: 'cgwDqI09rhA', title: 'माझ्या रक्तातील तो प्राचीन शाप: ३ जन्म, १ काळा नाग आणि नागपंचमीचं रहस्य!' },
  { id: 'awRa7Qvsfss', title: 'Fifth House – House of Creativity & Karma | प्रेम, मुलांचे भविष्य नष्ट करते?' },
  { id: 'k_TTAygZISk', title: 'Fourth House – House of Home & Emotional Foundations' },
  { id: 'SmbKAaxOqnU', title: 'Third House – Courage | तिसरं स्थान: पराक्रम की पराभव?' },
  { id: 'Luz1wexGlfA', title: 'Second House Astrology – धनाचा भाव तुमचं आयुष्य उद्ध्वस्त करू शकतो!' },
  { id: 'VCp4aSybTfA', title: 'Past Life Regression Sessions Videos' },
  { id: 'aPF7JyBjgpE', title: '५ वर्षांपासून का टिकत नव्हता एकही पैसा? पास्ट लाईफ रिग्रेशन सत्य!' },
  { id: 'WPuwxA--ke4', title: 'तिचं आयुष्य परिपूर्ण वाटत होतं… पण PLR मध्ये उघडलं धक्कादायक रहस्य!' },
  { id: 'Tdfey-oA9Kc', title: 'First House – House of Self & Identity | Astrology Basics' },
  { id: 'EQ_3tKO_2vk', title: 'होळीच्या दिवशी उघडलं पूर्वजन्माचं दार! पेशवेकाळातील धक्कादायक सत्य !!' },
  { id: 'V7lPaRX2Zqg', title: 'लग्न तुटलं कारण कर्माचं कर्ज बाकी होतं? | ती परत आली होती… अपूर्ण सूड?' }
];

export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  SIGNUP_FAILED: 'Signup failed. This email might already be registered.',
  BOOKING_FAILED: 'Failed to save booking. Please try again.',
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  DUPLICATE_BOOKING: 'You have already booked a session for this service on this date.',
  FIRESTORE_ERROR: 'Database error. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking confirmed! Please complete your payment.',
  PAYMENT_SUCCESS: 'Payment successful! Your booking is confirmed.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  SESSION_RESCHEDULED: 'Session rescheduled successfully.',
};

// ============================================
// SERVICE PRICING CONFIGURATION
// ============================================

export interface ServicePricing {
  serviceName: string;
  basic: number;
  standard: number;
  premium: number;
  description: string;
}

export const SERVICE_PRICING: ServicePricing[] = [
  {
    serviceName: 'Vedic Astrology',
    basic: 999,
    standard: 1999,
    premium: 3999,
    description: 'Traditional Vedic principles for accurate life predictions',
  },
  {
    serviceName: 'Kundali Analysis',
    basic: 1499,
    standard: 2499,
    premium: 4999,
    description: 'In-depth analysis of the 12 houses of your birth chart',
  },
  {
    serviceName: 'Vastu Shastra',
    basic: 1999,
    standard: 3499,
    premium: 5999,
    description: 'Harmonizing your home and office energy for prosperity',
  },
  {
    serviceName: 'Crystal Healing',
    basic: 999,
    standard: 1999,
    premium: 3499,
    description: 'Using sacred crystals to balance energy and well-being',
  },
  {
    serviceName: 'Spiritual Healing',
    basic: 1499,
    standard: 2999,
    premium: 4999,
    description: 'Energy healing and spiritual remedies for life challenges',
  },
  {
    serviceName: 'Past Life Regression',
    basic: 1999,
    standard: 3999,
    premium: 6999,
    description: 'Exploring past life connections and karmic patterns',
  },
  {
    serviceName: 'Meditation',
    basic: 499,
    standard: 999,
    premium: 1999,
    description: 'Techniques for mental peace and energy balancing',
  },
];

// ============================================
// PHYSICAL PRODUCTS CONFIGURATION
// ============================================

export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'gemstones' | 'books' | 'spiritual-items' | 'merchandise' | 'gift-sets';
  images: string[];
  stock: number;
  sku: string;
  benefits?: string[];
  featured?: boolean;
}

export const PRODUCT_CATEGORIES = [
  { id: 'gemstones', label: 'Gemstones', icon: 'gem' },
  { id: 'books', label: 'Books', icon: 'book' },
  { id: 'spiritual-items', label: 'Spiritual Items', icon: 'sparkles' },
  { id: 'merchandise', label: 'Merchandise', icon: 'tag' },
  { id: 'gift-sets', label: 'Gift Sets', icon: 'gift' },
];

export const FEATURED_PRODUCTS: ProductType[] = [
  {
    id: '1',
    name: 'Yellow Sapphire (Pukhraj)',
    description: 'Natural Yellow Sapphire for prosperity and business success',
    price: 4999,
    category: 'gemstones',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    ],
    stock: 15,
    sku: 'GEM-PUKHRAJ-001',
    benefits: ['Business Success', 'Prosperity', 'Intelligence', 'Confidence'],
    featured: true,
  },
  {
    id: '2',
    name: 'Blue Sapphire (Neelam)',
    description: 'Authentic Blue Sapphire for Saturn related benefits',
    price: 5999,
    category: 'gemstones',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop&q=80',
    ],
    stock: 12,
    sku: 'GEM-NEELAM-001',
    benefits: ['Health', 'Peace', 'Stability', 'Long Life'],
    featured: true,
  },
  {
    id: '3',
    name: 'Vedic Astrology Guide',
    description: 'Complete guide to understanding your birth chart and planetary positions',
    price: 599,
    category: 'books',
    images: [
      'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=500&h=500&fit=crop',
    ],
    stock: 50,
    sku: 'BOOK-VEDIC-001',
    benefits: ['Learn Astrology', 'Understand Kundali', 'Self Discovery'],
    featured: true,
  },
  {
    id: '4',
    name: 'Rudraksha Mala (108 Beads)',
    description: 'Sacred Rudraksha beads for meditation and spiritual practice',
    price: 1299,
    category: 'spiritual-items',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop&q=70',
    ],
    stock: 25,
    sku: 'SPRT-RUDRAKSHA-001',
    benefits: ['Meditation', 'Spiritual Peace', 'Mental Clarity'],
    featured: true,
  },
  {
    id: '5',
    name: 'Black Tourmaline Crystal',
    description: 'Powerful crystal for protection and grounding negative energies',
    price: 899,
    category: 'spiritual-items',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop&q=60',
    ],
    stock: 30,
    sku: 'CRYS-TOURMALINE-001',
    benefits: ['Protection', 'Grounding', 'Energy Cleansing', 'Stability'],
    featured: false,
  },
  {
    id: '6',
    name: 'Maharshi Bhrigu Branded T-Shirt',
    description: 'Premium quality branded merchandise for spiritual seekers',
    price: 499,
    category: 'merchandise',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    ],
    stock: 100,
    sku: 'MERCH-TSHIRT-001',
    benefits: ['Premium Cotton', 'Comfortable Fit'],
    featured: false,
  },
];

// ============================================
// PROMO CODES CONFIGURATION
// ============================================

export const SAMPLE_PROMO_CODES = [
  {
    code: 'WELCOME20',
    description: '20% off on your first booking',
    discountType: 'percentage' as const,
    discountValue: 20,
  },
  {
    code: 'NEWUSER15',
    description: '15% discount on all services',
    discountType: 'percentage' as const,
    discountValue: 15,
  },
  {
    code: 'SAVE500',
    description: 'Flat ₹500 off on bookings above ₹2000',
    discountType: 'fixed' as const,
    discountValue: 500,
  },
];


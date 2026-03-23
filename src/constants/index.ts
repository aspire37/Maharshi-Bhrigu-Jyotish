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

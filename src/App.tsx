/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Moon, 
  Sun, 
  Eye, 
  Sparkles, 
  Youtube, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight, 
  Menu, 
  X,
  Star,
  Wind,
  Heart,
  User,
  LogOut,
  Lock,
  Calendar,
  MessageSquare,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  User as FirebaseUser 
} from 'firebase/auth';
import { addDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import FAQComponent from './components/FAQ';
import { ProductsCatalog } from './components/ProductsCatalog';
import { ServicePricingDisplay } from './components/ServicePricingDisplay';
import { PromoCodeWidget } from './components/PromoCodeWidget';

const services = [
  {
    title: "Vedic Astrology",
    titleMr: "वैदिक ज्योतिष",
    description: "Traditional Vedic principles for accurate life predictions and guidance.",
    icon: <Sun className="w-8 h-8 text-spiritual-gold" />,
  },
  {
    title: "Crystal Healing",
    titleMr: "क्रिस्टल हीलिंग",
    description: "Using sacred crystals to balance energy and promote spiritual well-being.",
    icon: <Sparkles className="w-8 h-8 text-spiritual-gold" />,
  },
  {
    title: "Kundali Analysis",
    titleMr: "कुंडली विश्लेषण",
    description: "In-depth analysis of the 12 houses of your birth chart.",
    icon: <Moon className="w-8 h-8 text-spiritual-gold" />,
  },
  {
    title: "Vastu Shastra",
    titleMr: "वास्तु शास्त्र",
    description: "Harmonizing your home and office energy for prosperity.",
    icon: <Compass className="w-8 h-8 text-spiritual-gold" />,
  },
  {
    title: "Meditation",
    titleMr: "ध्यान",
    description: "Techniques for mental peace and energy balancing.",
    icon: <Wind className="w-8 h-8 text-spiritual-gold" />,
  },
  {
    title: "Spiritual Healing",
    titleMr: "Spiritual Healing",
    description: "Energy healing and spiritual remedies for life's challenges.",
    icon: <Heart className="w-8 h-8 text-spiritual-gold" />,
  },
  {
    title: "Past Life Regression",
    titleMr: "Past Life Regression",
    description: "Exploring past life connections and karmic patterns.",
    icon: <Eye className="w-8 h-8 text-spiritual-gold" />,
  }
];

const YOUTUBE_VIDEO_POOL = [
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

const POOL_VERSION = '1.3'; // Increment this to force cache refresh

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMyBookingsModalOpen, setIsMyBookingsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
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
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Vedic Astrology',
    message: '',
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [featuredVideos, setFeaturedVideos] = useState<any[]>(YOUTUBE_VIDEO_POOL.slice(0, 3).map(v => ({
    ...v,
    thumb: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`
  })));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // YouTube Video Randomization Logic
    const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
    const cacheKey = 'yt_videos_cache';
    
    const refreshVideos = () => {
      try {
        const shuffled = [...YOUTUBE_VIDEO_POOL].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4).map(v => ({
          ...v,
          thumb: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`
        }));
        
        const cacheData = {
          videos: selected,
          timestamp: Date.now(),
          version: POOL_VERSION
        };
        
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        setFeaturedVideos(selected);
      } catch (e) {
        console.error('Failed to refresh videos:', e);
        // Fallback to random without cache
        const shuffled = [...YOUTUBE_VIDEO_POOL].sort(() => 0.5 - Math.random());
        setFeaturedVideos(shuffled.slice(0, 4).map(v => ({
          ...v,
          thumb: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`
        })));
      }
    };

    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { videos, timestamp, version } = JSON.parse(cached);
        if (Date.now() - timestamp > REFRESH_INTERVAL || version !== POOL_VERSION) {
          refreshVideos();
        } else {
          setFeaturedVideos(videos);
        }
      } else {
        refreshVideos();
      }
    } catch (e) {
      console.error('Failed to load cached videos:', e);
      refreshVideos();
    }

    // Set up interval to check for refresh
    const interval = setInterval(() => {
      const currentCached = localStorage.getItem(cacheKey);
      if (currentCached) {
        const { timestamp } = JSON.parse(currentCached);
        if (Date.now() - timestamp > REFRESH_INTERVAL) {
          refreshVideos();
        }
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoginModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setIsLoginModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => signOut(auth);

  const savePaymentData = async () => {
    if (!user) {
      alert('User not authenticated');
      return;
    }

    try {
      const paymentData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'N/A',
        service: selectedService,
        bookingDate: preferredDate,
        additionalNotes: additionalNotes,
        amount: 999,
        currency: 'INR',
        paymentMethod: paymentMethod === 'gpay' ? 'Google Pay' : 'PhonePe',
        paymentStatus: 'Completed',
        transactionDate: new Date().toISOString(),
        timestamp: new Date()
      };

      const docRef = await addDoc(collection(db, 'payments'), paymentData);
      console.log('Payment data saved successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving payment data:', error);
      alert('Failed to save payment data. Please try again.');
    }
  };

  const handleBookingClick = () => {
    if (user) {
      setIsBookingModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleContactFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setContactError('');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');
    setContactSuccess(false);

    // Validation
    if (!contactForm.name.trim() || contactForm.name.trim().length < 2) {
      setContactError('Please enter a valid name');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setContactError('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contactForm.phone.replace(/\D/g, ''))) {
      setContactError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!contactForm.service) {
      setContactError('Please select a service');
      return;
    }

    if (contactForm.message.trim().length < 10) {
      setContactError('Message must be at least 10 characters');
      return;
    }

    try {
      setContactLoading(true);

      const response = await fetch('/api/mail/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setContactError(data.error || 'Failed to send message');
        return;
      }

      // Success
      setContactSuccess(true);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        service: 'Vedic Astrology',
        message: '',
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setContactSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error('Error sending contact form:', error);
      setContactError('Failed to send your message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    if (!user) return;
    
    setLoadingBookings(true);
    try {
      const q = query(
        collection(db, 'payments'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const bookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserBookings(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to fetch bookings. Please try again.');
    } finally {
      setLoadingBookings(false);
    }
  };

  const checkDuplicateBooking = async (service: string, date: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const q = query(
        collection(db, 'payments'),
        where('userId', '==', user.uid),
        where('service', '==', service),
        where('bookingDate', '==', date)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size > 0;
    } catch (error) {
      console.error('Error checking duplicate booking:', error);
      return false;
    }
  };

  const handleOpenMyBookings = async () => {
    setIsMyBookingsModalOpen(true);
    await fetchUserBookings();
  };

  return (
    <div className="min-h-screen selection:bg-spiritual-gold selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-white/10 backdrop-blur-md py-4 border-b border-white/10'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 spiritual-gradient rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className={`text-xl font-serif font-bold tracking-tight ${scrolled ? 'text-spiritual-ink' : 'text-white'}`}>
              Maharshi Bhrigu Jyotish
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Services', 'Pricing', 'Shop', 'YouTube', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-spiritual-gold ${scrolled ? 'text-spiritual-ink' : 'text-white'}`}
              >
                {item}
              </a>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleOpenMyBookings}
                  className={`text-xs font-bold px-4 py-2 rounded-full ${scrolled ? 'bg-blue-100 text-blue-600' : 'bg-white/20 text-white'} hover:scale-105 transition-all`}
                >
                  My Bookings
                </button>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <div className="w-6 h-6 rounded-full bg-spiritual-gold flex items-center justify-center text-[10px] font-bold text-spiritual-ink">
                    {user.photoURL ? <img src={user.photoURL} className="rounded-full" /> : user.email?.[0].toUpperCase()}
                  </div>
                  <span className={`text-xs font-bold ${scrolled ? 'text-spiritual-ink' : 'text-white'}`}>{user.displayName || user.email?.split('@')[0]}</span>
                </div>
                <button onClick={handleLogout} className="text-white/50 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className={`${scrolled ? 'bg-spiritual-maroon text-white' : 'bg-spiritual-gold text-spiritual-ink'} px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-md`}
              >
                Login
              </button>
            )}
            
            <button 
              onClick={handleBookingClick}
              className={`${scrolled ? 'bg-spiritual-gold text-spiritual-ink' : 'bg-white text-spiritual-ink'} px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-md`}
            >
              Book Session
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6 pb-6">
              {/* User Profile Section (when logged in) */}
              {user && (
                <div className="bg-gradient-to-r from-spiritual-maroon/20 to-spiritual-gold/20 rounded-xl p-4 border border-spiritual-maroon/20 mb-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-spiritual-gold flex items-center justify-center text-sm font-bold text-spiritual-ink">
                      {user.photoURL ? <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" /> : user.email?.[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-spiritual-ink text-sm">{user.displayName || user.email?.split('@')[0]}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              {['Home', 'Services', 'Pricing', 'Shop', 'YouTube', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xl font-serif text-spiritual-ink hover:text-spiritual-gold border-b border-gray-100 pb-4 transition-colors"
                >
                  {item}
                </a>
              ))}

              {/* Auth & Action Buttons Section */}
              <div className="space-y-3 mt-4">
                {user ? (
                  <>
                    <button 
                      onClick={() => {
                        handleOpenMyBookings();
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl text-base font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      My Bookings
                    </button>
                    <button 
                      onClick={handleBookingClick}
                      className="w-full bg-spiritual-gold text-spiritual-ink py-3 rounded-xl text-base font-bold hover:bg-spiritual-gold/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Book Session
                    </button>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-red-50 text-red-600 py-3 rounded-xl text-base font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-spiritual-maroon text-white py-3 rounded-xl text-base font-bold hover:bg-spiritual-maroon/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <User className="w-5 h-5" />
                      Login
                    </button>
                    <button 
                      onClick={() => {
                        handleBookingClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-spiritual-gold text-spiritual-ink py-3 rounded-xl text-base font-bold hover:bg-spiritual-gold/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Book Session
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="./banner.jpg" 
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (!img.src.includes("unsplash")) {
                img.src = "https://images.unsplash.com/photo-1528319725582-ddc0b6101511?auto=format&fit=crop&q=80&w=2000";
              }
            }}
            alt="Maharshi Bhrigu Jyotish Banner" 
            className="w-full h-full object-cover opacity-100"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          {/* Subtle gradient to ensure text readability on the left while keeping the right side clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 h-full flex items-end pb-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-xl bg-black/30 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-spiritual-gold/40 backdrop-blur-md rounded-full mb-6 border border-spiritual-gold/50">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">Ancient Wisdom for Modern Life</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-4 text-white drop-shadow-2xl">
              Authentic <span className="gold-text-gradient italic">Vedic Wisdom</span>
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-lg leading-relaxed font-medium drop-shadow-md">
              Traditional Vedic, Parashari, and Bhrigu principles to guide your karma and destiny.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleBookingClick}
                className="bg-spiritual-gold text-spiritual-ink px-8 py-4 rounded-full text-lg font-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.5)] flex items-center gap-2"
              >
                Book Session <ChevronRight className="w-5 h-5" />
              </button>
              <a 
                href="https://www.youtube.com/@MaharshiBhriguJyotish" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Youtube className="w-6 h-6 text-red-500" /> Watch Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* YouTube Latest Videos Section */}
      <section id="youtube-latest" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif mb-4 text-spiritual-ink">Latest from YouTube</h2>
              <p className="text-gray-500">Stay updated with our most recent spiritual insights and guidance.</p>
            </div>
            <a 
              href="https://www.youtube.com/@MaharshiBhriguJyotish/videos" 
              target="_blank" 
              className="hidden md:flex items-center gap-2 text-spiritual-maroon font-bold hover:underline"
            >
              View All Videos <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredVideos.slice(0, 3).map((video) => (
              <motion.a 
                key={video.id}
                href={video.id.length > 1 ? `https://www.youtube.com/watch?v=${video.id}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="group cursor-pointer block"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-lg">
                  <img src={video.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-red-600 fill-red-600" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-bold group-hover:text-spiritual-gold transition-colors">{video.title}</h3>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Community Section */}
      <section id="community" className="py-24 bg-spiritual-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-spiritual-ink">Community Insights</h2>
            <div className="w-24 h-1 bg-spiritual-gold mx-auto mb-6" />
            <p className="text-gray-500">Daily spiritual quotes, polls, and updates from our YouTube community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                date: '1 day ago', 
                text: 'गुढीपाडवा म्हणजे आनंदाचा सण! पण काही वेळा याच मुहूर्तावर संकटांची मालिका का सुरू होते? हे कर्माचे चक्र असू शकते. कर्माचा सिद्धांत सांगतो की आपण जे पेरतो तेच उगवते. 🙏✨',
                likes: '2.4k',
                comments: '156'
              },
              { 
                date: '3 days ago', 
                text: 'तुमच्या रक्तातील प्राचीन शाप आणि नागपंचमीचे रहस्य! ३ जन्मांपासून चालत आलेला तो काळा नाग... कर्माचा फेरा कधीच चुकत नाही. 🐍🕉️',
                likes: '1.8k',
                comments: '89'
              },
              { 
                date: '5 days ago', 
                text: '५ वर्षांपासून पैसा टिकत नाहीये? पास्ट लाईफ रिग्रेशनमध्ये अनेकदा याचे मूळ कारण दडलेले असते. कर्माचे कर्ज फेडल्याशिवाय आर्थिक प्रगती कठीण असते. 💰🕯️',
                likes: '3.1k',
                comments: '245'
              }
            ].map((post, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 spiritual-gradient rounded-full flex items-center justify-center">
                    <Sparkles className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-spiritual-ink">Maharshi Bhrigu Jyotish</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{post.date}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic flex-grow">"{post.text}"</p>
                <div className="flex items-center gap-6 text-xs text-gray-400 font-bold pt-4 border-t border-gray-50">
                  <span className="flex items-center gap-1 hover:text-spiritual-gold cursor-pointer"><Heart className="w-4 h-4" /> {post.likes}</span>
                  <span className="flex items-center gap-1 hover:text-spiritual-gold cursor-pointer"><MessageSquare className="w-4 h-4" /> {post.comments}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href="https://www.youtube.com/@MaharshiBhriguJyotish/community" 
              target="_blank"
              className="inline-flex items-center gap-2 bg-spiritual-maroon text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg"
            >
              Join the Community <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Sacred Services</h2>
            <div className="w-24 h-1 bg-spiritual-gold mx-auto mb-6" />
            <p className="text-gray-500 max-w-2xl mx-auto">
              Exploring the depths of Vedic sciences to bring clarity and harmony to your life's journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-spiritual-cream border border-gray-100 card-hover"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                <p className="text-spiritual-gold font-serif italic mb-4">{service.titleMr}</p>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-spiritual-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&q=80&w=1200" 
                alt="Spiritual Sciences" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-spiritual-maroon text-white p-10 rounded-3xl shadow-xl max-w-xs">
              <p className="font-serif italic text-xl mb-2">"भविष्य सांगणे नाही, तर जीवनाची दिशा स्पष्ट करणे."</p>
              <p className="text-sm opacity-80">— Maharshi Bhrigu Jyotish</p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
              Dedicated to Ancient <br />
              <span className="text-spiritual-gold">Spiritual Sciences</span>
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                हे चॅनेल समर्पित आहे वैदिक ज्योतिष (Vedic Astrology), क्रिस्टल हीलिंग (Crystal Healing), कुंडली विश्लेषण (Kundali Analysis), वास्तु शास्त्र (Vastu Shastra), ध्यान (Meditation), Spiritual Healing आणि Past Life Regression Therapy या प्राचीन आध्यात्मिक विज्ञानासाठी.
              </p>
              <p>
                आम्ही केवळ आधुनिक किंवा मनोवैज्ञानिक दृष्टिकोन मांडत नाही, तर आम्ही प्राचीन वैदिक, पराशरी ज्योतिष, नाडी ज्योतिष आणि क्रिस्टल हीलिंग यांसारख्या विविध शास्त्रशुद्ध पद्धतींचा अचूक संगम करून तुमच्यासमोर संपूर्ण शास्त्रीय ज्ञान सादर करतो.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div>
                  <h4 className="text-3xl font-serif text-spiritual-maroon">100%</h4>
                  <p className="text-sm uppercase tracking-widest font-bold">Authentic Vedic</p>
                </div>
                <div>
                  <h4 className="text-3xl font-serif text-spiritual-maroon">Ancient</h4>
                  <p className="text-sm uppercase tracking-widest font-bold">Bhrigu Lineage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section id="youtube" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-spiritual-ink rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-spiritual-gold/10 blur-3xl rounded-full -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 text-spiritual-gold mb-6">
                  <Youtube className="w-8 h-8" />
                  <span className="uppercase tracking-[0.3em] font-bold text-sm">Join Our Community</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif mb-6">Subscribe to our Spiritual Journey</h2>
                <p className="text-white/60 text-lg mb-8">
                  जर तुम्हाला ज्योतिष, वास्तु, ध्यान, हीलिंग आणि आध्यात्मिक ज्ञानात रस असेल — आत्ताच Subscribe करा आणि या ज्ञानयात्रेचा भाग बना.
                </p>
                <a 
                  href="https://www.youtube.com/@MaharshiBhriguJyotish" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-spiritual-ink px-8 py-4 rounded-full font-bold hover:bg-spiritual-gold hover:text-white transition-all"
                >
                  Visit YouTube Channel <ChevronRight className="w-5 h-5" />
                </a>
              </div>
              <div className="w-full md:w-1/3 aspect-video bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center group cursor-pointer overflow-hidden relative">
                {featuredVideos[3] && (
                  <a 
                    href={`https://www.youtube.com/watch?v=${featuredVideos[3].id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 w-full h-full"
                  >
                    <img 
                      src={featuredVideos[3].thumb} 
                      alt={featuredVideos[3].title} 
                      className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </a>
                )}
                {!featuredVideos[3] && (
                  <img 
                    src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=800" 
                    alt="Video Thumbnail" 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform pointer-events-none">
                  <Youtube className="w-10 h-10 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQComponent />

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif mb-8">Get in Touch</h2>
              <p className="text-gray-600 mb-12">
                Have questions about your horoscope or Vastu? We are here to guide you through the ancient wisdom of the sages.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-spiritual-cream rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="text-spiritual-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Email Us</h4>
                    <p className="text-gray-500">maharshibhrigujyotish@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-spiritual-cream rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="text-spiritual-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Call Us</h4>
                    <p className="text-gray-500">+91 (Contact via YouTube)</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-spiritual-cream rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="text-spiritual-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Location</h4>
                    <p className="text-gray-500">Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-spiritual-cream p-10 rounded-[2rem] border border-gray-100">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                {contactError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                  >
                    {contactError}
                  </motion.div>
                )}

                {contactSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="status"
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
                  >
                    ✅ Thank you! Your message has been sent successfully. We will contact you soon!
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactFormChange}
                      className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-spiritual-gold outline-none" 
                      placeholder="John Doe" 
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactFormChange}
                      className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-spiritual-gold outline-none" 
                      placeholder="john@example.com" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone Number (10 digits) *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactFormChange}
                    className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-spiritual-gold outline-none" 
                    placeholder="9158058080" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Service Interested In *</label>
                  <select 
                    name="service"
                    value={contactForm.service}
                    onChange={handleContactFormChange}
                    className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-spiritual-gold outline-none appearance-none"
                    required
                  >
                    <option>Vedic Astrology</option>
                    <option>Crystal Healing</option>
                    <option>Kundali Analysis</option>
                    <option>Vastu Shastra</option>
                    <option>Meditation</option>
                    <option>Spiritual Healing</option>
                    <option>Past Life Regression</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message (Minimum 10 characters) *</label>
                  <textarea 
                    rows={4} 
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-spiritual-gold outline-none" 
                    placeholder="Tell us about your requirements..."
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={contactLoading}
                  className="w-full bg-spiritual-maroon text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {contactLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  We will respond to your inquiry within 24 hours. For faster response, contact us on WhatsApp: +91 9158058080
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Pricing Section */}
      {user ? (
        <section id="pricing" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-spiritual-ink mb-4">Service Pricing</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Choose the perfect plan that suits your spiritual journey</p>
            </div>
            <ServicePricingDisplay />
          </div>
        </section>
      ) : (
        <section id="pricing" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-spiritual-ink mb-4">Service Pricing</h2>
              <p className="text-gray-600 mb-8">Please log in to view our service pricing</p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-8 py-3 bg-spiritual-maroon text-white rounded-lg hover:bg-spiritual-maroon/90 transition"
              >
                Login to View Pricing
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Products Catalog Section */}
      {user ? (
        <section id="shop" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-spiritual-ink mb-4">Spiritual Products</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Explore our curated collection of spiritual items and tools</p>
            </div>
            <ProductsCatalog />
          </div>
        </section>
      ) : (
        <section id="shop" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-spiritual-ink mb-4">Spiritual Products</h2>
              <p className="text-gray-600 mb-8">Please log in to browse our spiritual products</p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-8 py-3 bg-spiritual-maroon text-white rounded-lg hover:bg-spiritual-maroon/90 transition"
              >
                Login to Shop
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Promo Code Section */}
      <section id="promo" className="py-16 bg-gradient-to-r from-spiritual-maroon/10 to-spiritual-gold/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-spiritual-ink mb-4">Special Offers</h2>
            <p className="text-gray-600">Use our exclusive promo codes to get amazing discounts</p>
          </div>
          <PromoCodeWidget />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-spiritual-ink text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 spiritual-gradient rounded-full flex items-center justify-center">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-serif font-bold tracking-tight">Maharshi Bhrigu Jyotish</span>
              </div>
              <p className="text-white/40 max-w-md leading-relaxed">
                Dedicated to preserving and sharing the ancient wisdom of Vedic Astrology, Vastu, and Spiritual Sciences for the betterment of humanity.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-spiritual-gold">Quick Links</h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#shop" className="hover:text-white transition-colors">Shop</a></li>
                <li><a href="#youtube" className="hover:text-white transition-colors">YouTube</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-spiritual-gold">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-spiritual-gold transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-spiritual-gold transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-spiritual-gold transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-sm">
            <p>© 2026 Maharshi Bhrigu Jyotish. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="spiritual-gradient p-10 text-white text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-spiritual-gold" />
                <h2 className="text-3xl font-serif mb-2">{authMode === 'login' ? 'Welcome Back' : 'Join Us'}</h2>
                <p className="text-white/60 text-sm">Access ancient wisdom and book your sessions.</p>
              </div>
              
              <div className="p-10">
                {error && <p className="text-red-500 text-xs mb-4 text-center font-bold">{error}</p>}
                
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address" 
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-spiritual-gold outline-none text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password" 
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-spiritual-gold outline-none text-sm"
                    />
                  </div>
                  <button className="w-full bg-spiritual-maroon text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg">
                    {authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold">Or continue with</span></div>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" />
                  Google Login
                </button>

                <p className="text-center mt-8 text-sm text-gray-500">
                  {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="text-spiritual-maroon font-bold hover:underline"
                  >
                    {authMode === 'login' ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsBookingModalOpen(false);
                setPaymentDone(false);
                setPaymentMethod('gpay');
                setSelectedService('');
                setPreferredDate('');
                setAdditionalNotes('');
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {!paymentDone ? (
                <>
                  <div className="spiritual-gradient p-10 text-white flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-serif mb-2">Book a Session</h2>
                      <p className="text-white/60 text-sm">Complete your booking with payment.</p>
                    </div>
                    <button onClick={() => {
                      setIsBookingModalOpen(false);
                      setPaymentDone(false);
                    }} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-10 grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Select Service</label>
                        <select 
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-spiritual-gold outline-none appearance-none text-sm"
                        >
                          <option value="">Choose a service...</option>
                          {services.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Preferred Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          <input 
                            type="date" 
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-spiritual-gold outline-none text-sm" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Additional Notes</label>
                        <textarea 
                          rows={3} 
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-spiritual-gold outline-none text-sm" 
                          placeholder="Any specific questions?"
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="bg-spiritual-cream p-8 rounded-3xl border border-gray-100 flex flex-col">
                      <div className="mb-8">
                        <h4 className="font-bold mb-6 flex items-center gap-2 text-spiritual-ink">
                          <Sparkles className="w-5 h-5 text-spiritual-gold" /> Payment Details
                        </h4>
                        
                        {/* Barcode Scanner Image */}
                        <div className="mb-6 p-4 bg-white rounded-2xl border-2 border-dashed border-spiritual-gold/50 flex items-center justify-center">
                          <div className="text-center">
                            <img 
                              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=maharshi-bhrigu-99-iNR"
                              alt="Payment QR Code"
                              className="w-32 h-32 mx-auto mb-2"
                            />
                            <p className="text-xs text-gray-600 font-semibold">Scan to Pay ₹999</p>
                          </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="space-y-3 mb-6">
                          <label className="text-xs font-bold uppercase tracking-widest text-gray-600 block">Select Payment Method</label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-gray-200 cursor-pointer hover:border-spiritual-gold transition-colors">
                              <input 
                                type="radio" 
                                name="payment" 
                                value="gpay"
                                checked={paymentMethod === 'gpay'}
                                onChange={(e) => setPaymentMethod(e.target.value as 'gpay' | 'phonepe')}
                                className="w-5 h-5 accent-spiritual-gold cursor-pointer"
                              />
                              <div className="flex-1">
                                <div className="font-bold text-sm text-spiritual-ink">Google Pay</div>
                                <div className="text-xs text-gray-500">Pay securely via GPay</div>
                              </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-gray-200 cursor-pointer hover:border-spiritual-gold transition-colors">
                              <input 
                                type="radio" 
                                name="payment" 
                                value="phonepe"
                                checked={paymentMethod === 'phonepe'}
                                onChange={(e) => setPaymentMethod(e.target.value as 'gpay' | 'phonepe')}
                                className="w-5 h-5 accent-spiritual-gold cursor-pointer"
                              />
                              <div className="flex-1">
                                <div className="font-bold text-sm text-spiritual-ink">PhonePe</div>
                                <div className="text-xs text-gray-500">Pay securely via PhonePe</div>
                              </div>
                            </label>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-6">
                          <div className="flex justify-between mb-3 pb-3 border-b border-gray-100">
                            <span className="text-gray-600">Session Fee:</span>
                            <span className="font-bold text-spiritual-ink">₹999</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg">
                            <span className="text-spiritual-ink">Total Amount:</span>
                            <span className="text-spiritual-gold">₹999 INR</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button 
                          onClick={async () => {
                            if (!selectedService || !preferredDate) {
                              alert('Please select a service and date before proceeding');
                              return;
                            }
                            
                            const isDuplicate = await checkDuplicateBooking(selectedService, preferredDate);
                            if (isDuplicate) {
                              alert('❌ You have already booked a session for this service on this date. Please check your "My Bookings" or select a different date.');
                              return;
                            }

                            await savePaymentData();
                            setPaymentDone(true);
                          }}
                          className="w-full bg-spiritual-maroon text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
                        >
                          Proceed to Pay ₹999
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                          By booking, you agree to our terms and conditions
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Payment Done Screen
                <div className="p-10 flex flex-col items-center justify-center min-h-[500px]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="w-12 h-12 text-green-600"
                    >
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </motion.div>
                  </motion.div>

                  <h2 className="text-3xl font-serif text-spiritual-ink mb-2 text-center">Payment Successful!</h2>
                  <p className="text-gray-600 text-center mb-8">Your booking has been confirmed</p>

                  <div className="bg-spiritual-cream p-8 rounded-3xl w-full mb-8 border border-gray-200">
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-bold text-spiritual-ink">{selectedService}</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-bold text-spiritual-ink">{preferredDate}</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-bold text-spiritual-ink">{paymentMethod === 'gpay' ? 'Google Pay' : 'PhonePe'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-bold text-spiritual-gold text-lg">₹999</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                      <p className="text-sm text-blue-800 font-semibold">
                        📞 <strong>Please share your payment details on WhatsApp:</strong>
                      </p>
                      <a 
                        href={`https://wa.me/919158058080?text=I%20have%20completed%20my%20payment%20of%20₹999%20for%20${encodeURIComponent(selectedService)}%20session%20on%20${encodeURIComponent(preferredDate)}%20via%20${paymentMethod === 'gpay' ? 'Google Pay' : 'PhonePe'}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold hover:underline mt-2 block"
                      >
                        WhatsApp: +91 9158058080
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <a 
                      href={`https://wa.me/919158058080?text=I%20have%20completed%20my%20payment%20of%20₹999%20for%20${encodeURIComponent(selectedService)}%20session%20on%20${encodeURIComponent(preferredDate)}%20via%20${paymentMethod === 'gpay' ? 'Google Pay' : 'PhonePe'}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Phone className="w-5 h-5" /> Share on WhatsApp
                    </a>
                    <button 
                      onClick={() => {
                        setIsBookingModalOpen(false);
                        setPaymentDone(false);
                        setPaymentMethod('gpay');
                        setSelectedService('');
                        setPreferredDate('');
                        setAdditionalNotes('');
                      }}
                      className="flex-1 bg-spiritual-maroon text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* My Bookings Modal */}
      <AnimatePresence>
        {isMyBookingsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMyBookingsModalOpen(false)}
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
                  <p className="text-white/60 text-sm">View all your booked sessions</p>
                </div>
                <button onClick={() => setIsMyBookingsModalOpen(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10">
                {loadingBookings ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin">
                      <Sparkles className="w-8 h-8 text-spiritual-gold" />
                    </div>
                    <span className="ml-3 text-gray-600">Loading your bookings...</span>
                  </div>
                ) : userBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-spiritual-cream rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-spiritual-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-spiritual-ink mb-2">No Bookings Yet</h3>
                    <p className="text-gray-600 mb-6">You haven't booked any sessions yet.</p>
                    <button 
                      onClick={() => {
                        setIsMyBookingsModalOpen(false);
                        handleBookingClick();
                      }}
                      className="bg-spiritual-maroon text-white px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all"
                    >
                      Book First Session
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userBookings.map((booking, idx) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gradient-to-r from-spiritual-cream to-white p-6 rounded-2xl border-2 border-spiritual-gold/30 hover:border-spiritual-gold transition-all shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-spiritual-ink mb-1">{booking.service}</h3>
                            <p className="text-sm text-gray-600">
                              <strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            {booking.paymentStatus}
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span className="font-semibold text-spiritual-ink">{booking.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amount Paid:</span>
                            <span className="font-semibold text-spiritual-gold">₹{booking.amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Booked On:</span>
                            <span className="font-semibold text-spiritual-ink">
                              {new Date(booking.transactionDate).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          {booking.additionalNotes && (
                            <div className="flex justify-between">
                              <span>Notes:</span>
                              <span className="font-semibold text-spiritual-ink italic">{booking.additionalNotes}</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-gray-200 flex gap-3">
                          <a 
                            href={`https://wa.me/919158058080?text=Hi, I have a query about my booking for ${encodeURIComponent(booking.service)} on ${encodeURIComponent(booking.bookingDate)}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                          >
                            <Phone className="w-4 h-4" /> Contact Support
                          </a>
                          <button 
                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold hover:bg-gray-300 transition-all"
                          >
                            Reschedule
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
}

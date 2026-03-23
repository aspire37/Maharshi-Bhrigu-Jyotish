import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  scrolled: boolean;
  user: any;
  onLoginClick: () => void;
  onLogout: () => void;
  onAdminClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  scrolled,
  user,
  onLoginClick,
  onLogout,
  onAdminClick,
}) => {
  const { i18n } = useTranslation();
  const [languageOpen, setLanguageOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white shadow-lg py-2'
            : 'bg-white/10 backdrop-blur-md py-4 border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 spiritual-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xs">MB</span>
            </div>
            <span
              className={`font-serif font-bold tracking-tight hidden md:inline transition-colors ${
                scrolled ? 'text-spiritual-ink' : 'text-white'
              }`}
            >
              Maharshi Bhrigu
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            {['#home', '#services', '#about', '#contact'].map((href, idx) => (
              <a
                key={idx}
                href={href}
                className={`font-medium transition-colors hover:text-spiritual-gold ${
                  scrolled ? 'text-gray-600' : 'text-white'
                }`}
              >
                {href === '#home'
                  ? 'Home'
                  : href === '#services'
                    ? 'Services'
                    : href === '#about'
                      ? 'About'
                      : 'Contact'}
              </a>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className={`py-2 px-3 rounded-lg text-sm font-bold transition-colors ${
                  scrolled
                    ? 'bg-gray-100 text-spiritual-ink hover:bg-gray-200'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {i18n.language === 'mr' ? 'मराठी' : 'EN'}
              </button>
              <AnimatePresence>
                {languageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    <button
                      onClick={() => {
                        i18n.changeLanguage('en');
                        setLanguageOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 text-spiritual-ink font-medium"
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        i18n.changeLanguage('mr');
                        setLanguageOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 text-spiritual-ink font-medium border-t"
                    >
                      मराठी
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons */}
            {!user ? (
              <button
                onClick={onLoginClick}
                className="hidden md:flex items-center gap-2 bg-spiritual-maroon text-white px-6 py-2 rounded-full font-bold hover:scale-105 transition-all"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={onAdminClick}
                  className="px-4 py-2 text-sm bg-spiritual-gold text-spiritual-ink rounded-lg font-bold hover:scale-105 transition-all"
                >
                  Admin
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-spiritual-maroon font-bold hover:scale-105 transition-all"
                    aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X
                  className={`w-6 h-6 ${scrolled ? 'text-spiritual-ink' : 'text-white'}`}
                />
              ) : (
                <Menu
                  className={`w-6 h-6 ${scrolled ? 'text-spiritual-ink' : 'text-white'}`}
                />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 bg-white shadow-xl z-40 md:hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {['#home', '#services', '#about', '#contact'].map((href, idx) => (
                <a
                  key={idx}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block font-medium text-gray-700 hover:text-spiritual-gold"
                >
                  {href === '#home'
                    ? 'Home'
                    : href === '#services'
                      ? 'Services'
                      : href === '#about'
                        ? 'About'
                        : 'Contact'}
                </a>
              ))}

              {!user ? (
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-spiritual-maroon text-white py-3 rounded-lg font-bold hover:bg-opacity-90"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gray-200 text-spiritual-ink py-3 rounded-lg font-bold hover:bg-gray-300"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

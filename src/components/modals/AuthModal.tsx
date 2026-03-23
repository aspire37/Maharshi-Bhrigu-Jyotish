import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { loginSchema, signupSchema } from '../../constants';
import { getZodErrors, getErrorByField } from '../../utils/validation';
import { FormValidationError } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginEmail: (email: string, password: string) => Promise<void>;
  onSignupEmail: (email: string, password: string, name: string) => Promise<void>;
  onLoginGoogle: () => Promise<void>;
  isLoading: boolean;
  error: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginEmail,
  onSignupEmail,
  onLoginGoogle,
  isLoading,
  error: externalError,
}) => {
  const { t } = useTranslation();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<FormValidationError[]>([]);
  const [localError, setLocalError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    setErrors((prev) => prev.filter((err) => err.field !== name));
    setLocalError('');
  };

  const validateForm = (): boolean => {
    try {
      setErrors([]);

      if (authMode === 'login') {
        loginSchema.parse({
          email: formData.email,
          password: formData.password,
        });
      } else {
        if (formData.password !== formData.confirmPassword) {
          setErrors([
            {
              field: 'confirmPassword',
              message: t('errors.passwordMismatch') || 'Passwords do not match',
            },
          ]);
          return false;
        }

        signupSchema.parse({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
      }

      return true;
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(getZodErrors(err));
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) {
      return;
    }

    try {
      if (authMode === 'login') {
        await onLoginEmail(formData.email, formData.password);
      } else {
        await onSignupEmail(
          formData.email,
          formData.password,
          `${formData.firstName} ${formData.lastName}`
        );
      }

      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
      });
      onClose();
    } catch (err: any) {
      setLocalError(err.message || t('errors.loginFailed'));
    }
  };

  const displayError = localError || externalError;

  return (
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
            className="relative bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="spiritual-gradient p-10 text-white text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-spiritual-gold" />
              <h2 className="text-3xl font-serif mb-2">
                {authMode === 'login' ? t('auth.login') : t('auth.signup')}
              </h2>
              <p className="text-white/60 text-sm">
                {authMode === 'login'
                  ? 'Access your bookings and profile'
                  : 'Create your account to get started'}
              </p>
            </div>

            <div className="p-10">
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  aria-live="polite"
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
                >
                  {displayError}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {t('auth.firstName')}
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-50 border rounded-2xl px-4 py-3 focus:ring-2 focus:ring-spiritual-gold outline-none transition-all ${
                          getErrorByField(errors, 'firstName')
                            ? 'border-red-500'
                            : 'border-none'
                        }`}
                        aria-invalid={!!getErrorByField(errors, 'firstName')}
                        aria-describedby={
                          getErrorByField(errors, 'firstName')
                            ? 'firstName-error'
                            : undefined
                        }
                      />
                      {getErrorByField(errors, 'firstName') && (
                        <p id="firstName-error" className="text-red-600 text-xs">
                          {getErrorByField(errors, 'firstName')}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {t('auth.lastName')}
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-50 border rounded-2xl px-4 py-3 focus:ring-2 focus:ring-spiritual-gold outline-none transition-all ${
                          getErrorByField(errors, 'lastName')
                            ? 'border-red-500'
                            : 'border-none'
                        }`}
                        aria-invalid={!!getErrorByField(errors, 'lastName')}
                      />
                      {getErrorByField(errors, 'lastName') && (
                        <p className="text-red-600 text-xs">
                          {getErrorByField(errors, 'lastName')}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {t('auth.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={`w-full bg-gray-50 border rounded-2xl px-4 py-3 focus:ring-2 focus:ring-spiritual-gold outline-none transition-all ${
                      getErrorByField(errors, 'email')
                        ? 'border-red-500'
                        : 'border-none'
                    }`}
                    aria-invalid={!!getErrorByField(errors, 'email')}
                  />
                  {getErrorByField(errors, 'email') && (
                    <p className="text-red-600 text-xs">
                      {getErrorByField(errors, 'email')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {t('auth.password')}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-50 border rounded-2xl px-4 py-3 focus:ring-2 focus:ring-spiritual-gold outline-none transition-all ${
                      getErrorByField(errors, 'password')
                        ? 'border-red-500'
                        : 'border-none'
                    }`}
                    aria-invalid={!!getErrorByField(errors, 'password')}
                  />
                  {getErrorByField(errors, 'password') && (
                    <p className="text-red-600 text-xs">
                      {getErrorByField(errors, 'password')}
                    </p>
                  )}
                </div>

                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {t('auth.confirmPassword')}
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-50 border rounded-2xl px-4 py-3 focus:ring-2 focus:ring-spiritual-gold outline-none transition-all ${
                        getErrorByField(errors, 'confirmPassword')
                          ? 'border-red-500'
                          : 'border-none'
                      }`}
                      aria-invalid={!!getErrorByField(
                        errors,
                        'confirmPassword'
                      )}
                    />
                    {getErrorByField(errors, 'confirmPassword') && (
                      <p className="text-red-600 text-xs">
                        {getErrorByField(errors, 'confirmPassword')}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-spiritual-maroon text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? 'Processing...'
                    : authMode === 'login'
                      ? t('auth.signIn')
                      : t('auth.createAccount')}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {t('auth.orContinueWith')}
                  </span>
                </div>
              </div>

              <button
                onClick={onLoginGoogle}
                disabled={isLoading}
                className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  className="w-5 h-5"
                  alt=""
                />
                {t('auth.googleLogin')}
              </button>

              <p className="text-center mt-8 text-sm text-gray-500">
                {authMode === 'login' ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setFormData({
                      email: '',
                      password: '',
                      confirmPassword: '',
                      firstName: '',
                      lastName: '',
                    });
                    setErrors([]);
                    setLocalError('');
                  }}
                  className="text-spiritual-maroon font-bold hover:underline"
                >
                  {authMode === 'login' ? t('auth.signup') : t('auth.login')}
                </button>
              </p>
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

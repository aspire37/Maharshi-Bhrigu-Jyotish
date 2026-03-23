import { ZodError } from 'zod';
import { FormValidationError } from '../types';

export const getZodErrors = (error: ZodError): FormValidationError[] => {
  return error.errors.map((err) => ({
    field: String(err.path[0]),
    message: err.message,
  }));
};

export const getErrorByField = (
  errors: FormValidationError[],
  field: string
): string | undefined => {
  return errors.find((err) => err.field === field)?.message;
};

export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, 500); // Limit to 500 chars and trim
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isFutureDate = (dateString: string): boolean => {
  return new Date(dateString) > new Date();
};

export const getWhatsAppLink = (message: string): string => {
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919158058080';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

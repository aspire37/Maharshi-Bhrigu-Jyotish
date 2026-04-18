import { useState, useCallback } from 'react';
import { PromoCode } from '../types';

export const usePromoCode = () => {
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
  } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  // Sample promo codes store (in production, this would be from Firestore)
  const validPromoCodes: Record<string, Omit<PromoCode, 'id' | 'createdAt'>> = {
    WELCOME20: {
      code: 'WELCOME20',
      discountType: 'percentage',
      discountValue: 20,
      validUntil: new Date(2026, 11, 31).toISOString(),
      usageLimit: 1000,
      usedCount: 450,
      active: true,
      minOrderAmount: 2000,
    },
    NEWUSER15: {
      code: 'NEWUSER15',
      discountType: 'percentage',
      discountValue: 15,
      validUntil: new Date(2026, 11, 31).toISOString(),
      usageLimit: 5000,
      usedCount: 1200,
      active: true,
    },
    SAVE500: {
      code: 'SAVE500',
      discountType: 'fixed',
      discountValue: 500,
      validUntil: new Date(2026, 6, 31).toISOString(),
      usageLimit: 2000,
      usedCount: 890,
      active: true,
      minOrderAmount: 2000,
    },
    SPIRITUAL10: {
      code: 'SPIRITUAL10',
      discountType: 'percentage',
      discountValue: 10,
      validUntil: new Date(2026, 11, 31).toISOString(),
      usageLimit: 3000,
      usedCount: 234,
      active: true,
    },
  };

  const validatePromoCode = useCallback(
    async (code: string, orderAmount: number = 0): Promise<boolean> => {
      try {
        setPromoError('');
        setPromoLoading(true);

        if (!code.trim()) {
          setPromoError('Please enter a promo code');
          return false;
        }

        const upperCode = code.toUpperCase().trim();
        const promoData = validPromoCodes[upperCode];

        if (!promoData) {
          setPromoError('Invalid promo code');
          return false;
        }

        if (!promoData.active) {
          setPromoError('This promo code is no longer active');
          return false;
        }

        if (new Date(promoData.validUntil) < new Date()) {
          setPromoError('This promo code has expired');
          return false;
        }

        if (promoData.usedCount >= promoData.usageLimit) {
          setPromoError('This promo code has reached its usage limit');
          return false;
        }

        if (promoData.minOrderAmount && orderAmount < promoData.minOrderAmount) {
          setPromoError(
            `Minimum order amount of ₹${promoData.minOrderAmount} required for this promo`
          );
          return false;
        }

        // Calculate discount
        let discount = 0;
        if (promoData.discountType === 'percentage') {
          discount = (orderAmount * promoData.discountValue) / 100;
        } else {
          discount = promoData.discountValue;
        }

        setAppliedPromo({
          code: upperCode,
          discount,
          discountType: promoData.discountType,
        });

        return true;
      } catch (error: any) {
        console.error('Error validating promo code:', error);
        setPromoError('Failed to validate promo code');
        return false;
      } finally {
        setPromoLoading(false);
      }
    },
    []
  );

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
    setPromoError('');
  }, []);

  const getPromoDetails = useCallback((code: string) => {
    const upperCode = code.toUpperCase().trim();
    return validPromoCodes[upperCode];
  }, []);

  return {
    appliedPromo,
    promoError,
    promoLoading,
    validatePromoCode,
    removePromoCode,
    getPromoDetails,
    validPromoCodes,
  };
};

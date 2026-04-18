import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Check, X, Copy, Info } from 'lucide-react';
import { usePromoCode } from '../hooks';
import { SAMPLE_PROMO_CODES } from '../constants';

interface PromoCodeWidgetProps {
  orderAmount?: number;
  onApply?: (discountAmount: number, code: string) => void;
}

export const PromoCodeWidget: React.FC<PromoCodeWidgetProps> = ({
  orderAmount = 0,
  onApply,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const { appliedPromo, promoError, promoLoading, validatePromoCode, removePromoCode } =
    usePromoCode();

  const handleValidatePromo = async () => {
    const isValid = await validatePromoCode(promoInput, orderAmount);
    if (isValid && appliedPromo) {
      setPromoInput('');
      if (onApply) {
        onApply(appliedPromo.discount, appliedPromo.code);
      }
    }
  };

  const handleQuickApply = async (code: string) => {
    const isValid = await validatePromoCode(code, orderAmount);
    if (isValid && appliedPromo) {
      setPromoInput('');
      setShowSuggestions(false);
      if (onApply) {
        onApply(appliedPromo.discount, appliedPromo.code);
      }
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-spiritual-maroon/10 to-spiritual-gold/10 rounded-2xl p-6 border-2 border-spiritual-gold/20">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-spiritual-gold" />
        <h3 className="font-bold text-lg text-spiritual-ink">Promo Code</h3>
      </div>

      {/* Applied Promo Display */}
      {appliedPromo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-green-50 border-2 border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-bold text-green-700">{appliedPromo.code}</p>
                <p className="text-sm text-green-600">
                  {appliedPromo.discountType === 'percentage'
                    ? `${appliedPromo.discount.toFixed(0)}% discount applied`
                    : `₹${appliedPromo.discount.toFixed(0)} saved`}
                </p>
              </div>
            </div>
            <button
              onClick={removePromoCode}
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Input Section */}
      {!appliedPromo && (
        <div className="space-y-3 mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value.toUpperCase());
                setShowSuggestions(true);
              }}
              placeholder="Enter promo code"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-spiritual-gold outline-none transition-colors"
              onFocus={() => setShowSuggestions(true)}
            />
            <button
              onClick={handleValidatePromo}
              disabled={!promoInput.trim() || promoLoading}
              className="px-6 py-3 bg-spiritual-maroon text-white rounded-lg font-bold hover:bg-spiritual-maroon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {promoLoading ? 'Validating...' : 'Apply'}
            </button>
          </div>

          {/* Error Message */}
          {promoError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-gap gap-2"
            >
              <X className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{promoError}</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Suggestions Section */}
      <AnimatePresence>
        {showSuggestions && !appliedPromo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-spiritual-gold" />
              <p className="text-sm font-semibold text-gray-700">Available Offers</p>
            </div>

            <div className="space-y-2">
              {SAMPLE_PROMO_CODES.map((promo) => (
                <div
                  key={promo.code}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleQuickApply(promo.code)}
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{promo.code}</p>
                    <p className="text-xs text-gray-600">{promo.description}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyCode(promo.code);
                    }}
                    className="ml-2 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copied === promo.code ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </motion.button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSuggestions(false)}
              className="mt-3 w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close suggestions
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Benefit Info */}
      {appliedPromo && (
        <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-spiritual-gold">
              You save: ₹{appliedPromo.discount.toFixed(0)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

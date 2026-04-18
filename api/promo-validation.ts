import { VercelRequest, VercelResponse } from "@vercel/node";

interface ValidatePromoRequest {
  code: string;
  orderAmount?: number;
}

interface PromoCodeData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  minOrderAmount?: number;
}

// Sample promo codes (in production, fetch from Firestore)
const PROMO_CODES: Record<string, PromoCodeData> = {
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

interface ValidatePromoResponse {
  success: boolean;
  code?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discount?: number;
  orderAmount?: number;
  finalAmount?: number;
  message?: string;
  error?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed" 
    });
  }

  try {
    const { code, orderAmount = 0 } = req.body as ValidatePromoRequest;

    // Validation
    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: "Promo code is required",
      });
    }

    const upperCode = code.toUpperCase().trim();
    const promoData = PROMO_CODES[upperCode];

    // Check if code exists
    if (!promoData) {
      return res.status(404).json({
        success: false,
        error: "Invalid promo code",
      });
    }

    // Check if code is active
    if (!promoData.active) {
      return res.status(400).json({
        success: false,
        error: "This promo code is no longer active",
      });
    }

    // Check if code is expired
    if (new Date(promoData.validUntil) < new Date()) {
      return res.status(400).json({
        success: false,
        error: "This promo code has expired",
      });
    }

    // Check usage limit
    if (promoData.usedCount >= promoData.usageLimit) {
      return res.status(400).json({
        success: false,
        error: "This promo code has reached its usage limit",
      });
    }

    // Check minimum order amount
    if (promoData.minOrderAmount && orderAmount < promoData.minOrderAmount) {
      return res.status(400).json({
        success: false,
        error: `Minimum order amount of ₹${promoData.minOrderAmount} required for this promo`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (promoData.discountType === 'percentage') {
      discount = (orderAmount * promoData.discountValue) / 100;
    } else {
      discount = promoData.discountValue;
    }

    const finalAmount = Math.max(0, orderAmount - discount);

    return res.status(200).json({
      success: true,
      code: upperCode,
      discountType: promoData.discountType,
      discountValue: promoData.discountValue,
      discount: Math.round(discount),
      orderAmount,
      finalAmount: Math.round(finalAmount),
      message: `Promo code applied successfully! You saved ₹${Math.round(discount)}`,
    });
  } catch (error: any) {
    console.error("Error validating promo code:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to validate promo code",
    });
  }
}

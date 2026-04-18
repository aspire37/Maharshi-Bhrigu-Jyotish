/**
 * Image Path Utility - Automatically fixes and validates image paths
 * Handles multiple formats and provides fallbacks
 */

export const normalizeImagePath = (imagePath: string): string => {
  if (!imagePath) {
    return 'https://via.placeholder.com/400?text=No+Image';
  }

  // If it starts with http, it's already a full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Remove 'public\' or 'public/' prefix if present
  let normalized = imagePath.replace(/^public[\\\/]/, '');

  // Replace backslashes with forward slashes (Windows path fix)
  normalized = normalized.replace(/\\/g, '/');

  // Ensure it starts with /
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }

  return normalized;
};

/**
 * Get fallback images for different scenarios
 */
export const getFallbackImage = (productName: string): string => {
  return `https://via.placeholder.com/400?text=${encodeURIComponent(productName)}`;
};

/**
 * Validate image exists and return proper URL
 */
export const getImageUrl = (imagePath: string, productName: string): string => {
  const normalized = normalizeImagePath(imagePath);
  
  // Log for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Image] ${productName}: ${imagePath} → ${normalized}`);
  }

  return normalized;
};

/**
 * Handle image load errors with fallbacks
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, productName: string): void => {
  const img = e.currentTarget;
  
  // Try fallback image
  if (!img.src.includes('placeholder.com')) {
    console.warn(`[Image Error] ${productName}: Failed to load ${img.src}`);
    img.src = getFallbackImage(productName);
  }
};

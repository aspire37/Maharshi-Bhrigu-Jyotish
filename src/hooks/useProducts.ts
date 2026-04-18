import { useState, useCallback } from 'react';
import { Product, CartItem } from '../types';
import { FEATURED_PRODUCTS } from '../constants';

export const useProducts = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch all products (in production, from Firestore)
  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    try {
      // For now, return featured products
      // In production: const snapshot = await getDocs(collection(db, 'products'));
      return FEATURED_PRODUCTS;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }, []);

  // Fetch products by category
  const fetchProductsByCategory = useCallback(
    async (category: string): Promise<Product[]> => {
      try {
        const products = await fetchProducts();
        return products.filter((p) => p.category === category);
      } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
      }
    },
    [fetchProducts]
  );

  // Fetch single product
  const fetchProductById = useCallback(
    async (id: string): Promise<Product | null> => {
      try {
        const products = await fetchProducts();
        return products.find((p) => p.id === id) || null;
      } catch (error) {
        console.error('Error fetching product:', error);
        return null;
      }
    },
    [fetchProducts]
  );

  // Add to cart
  const addToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      setCartLoading(true);
      try {
        setCart((prevCart) => {
          const existingItem = prevCart.find((item) => item.productId === product.id);

          if (existingItem) {
            return prevCart.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }

          return [
            ...prevCart,
            {
              productId: product.id,
              quantity,
              price: product.price,
              product,
            },
          ];
        });
      } finally {
        setCartLoading(false);
      }
    },
    []
  );

  // Remove from cart
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  }, []);

  // Update cart quantity
  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Get cart total
  const getCartTotal = useCallback((): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  // Get cart item count
  const getCartCount = useCallback((): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    cartLoading,
    fetchProducts,
    fetchProductsByCategory,
    fetchProductById,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };
};

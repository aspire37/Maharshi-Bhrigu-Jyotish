import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Star, Heart, X, X as CloseIcon } from 'lucide-react';
import { FEATURED_PRODUCTS, PRODUCT_CATEGORIES } from '../constants';
import { Product } from '../types';

interface ProductCatalogProps {
  onAddToCart?: (product: Product, quantity: number) => void;
}

export const ProductsCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(FEATURED_PRODUCTS);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (selectedCategory) {
      setDisplayedProducts(
        FEATURED_PRODUCTS.filter((p) => p.category === selectedCategory)
      );
    } else {
      setDisplayedProducts(FEATURED_PRODUCTS);
    }
  }, [selectedCategory]);

  const handleAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product, 1);
      setCartCount((prev) => prev + 1);

      // Show success feedback
      setTimeout(() => setCartCount((prev) => Math.max(0, prev - 1)), 2000);
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-spiritual-ink mb-4">
            Spiritual Products Store
          </h2>
          <p className="text-xl text-gray-600">
            Authentic spiritual items selected with care for your journey
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              selectedCategory === null
                ? 'bg-spiritual-maroon text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Products
          </motion.button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-spiritual-maroon text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="group bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all"
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.featured && (
                  <div className="absolute top-4 right-4 bg-spiritual-gold text-spiritual-ink px-3 py-1 rounded-full text-xs font-bold">
                    Featured
                  </div>
                )}
                <button className="absolute top-4 left-4 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
                  <Heart className="w-5 h-5 text-spiritual-maroon" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-spiritual-gold">
                    {product.category.replace('-', ' ')}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-spiritual-ink mb-2 group-hover:text-spiritual-maroon transition-colors">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Benefits */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {product.benefits.slice(0, 2).map((benefit) => (
                      <span
                        key={benefit}
                        className="text-xs bg-spiritual-cream text-spiritual-ink px-2 py-1 rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-spiritual-maroon">
                    ₹{product.price}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-spiritual-gold text-spiritual-gold" />
                    <span className="text-sm font-semibold text-gray-700">4.8</span>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-4 text-xs font-semibold">
                  {product.stock > 10 ? (
                    <span className="text-green-600">✓ In Stock ({product.stock})</span>
                  ) : product.stock > 0 ? (
                    <span className="text-orange-600">⚠ Only {product.stock} left</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1 bg-gray-100 text-spiritual-ink py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1 bg-spiritual-maroon text-white py-2 rounded-lg font-bold hover:bg-spiritual-maroon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-6 right-6 z-10 bg-white rounded-full p-3 hover:bg-gray-100 transition-colors"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>

                <div className="grid md:grid-cols-2 gap-8 p-8">
                  {/* Product Image */}
                  <div>
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="w-full h-96 object-cover rounded-2xl"
                    />
                  </div>

                  {/* Product Details */}
                  <div>
                    <div className="mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-spiritual-gold">
                        {selectedProduct.category.replace('-', ' ')}
                      </span>
                    </div>

                    <h2 className="text-4xl font-serif font-bold text-spiritual-ink mb-4">
                      {selectedProduct.name}
                    </h2>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {selectedProduct.description}
                    </p>

                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Benefits:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.benefits?.map((benefit) => (
                          <span
                            key={benefit}
                            className="bg-spiritual-cream text-spiritual-ink px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            ✓ {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-700">Price</span>
                        <span className="text-3xl font-bold text-spiritual-maroon">
                          ₹{selectedProduct.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Availability</span>
                        <span
                          className={`font-bold ${
                            selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {selectedProduct.stock > 0
                            ? `${selectedProduct.stock} in stock`
                            : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-6 flex items-center gap-4">
                      <span className="font-semibold text-gray-700">Quantity:</span>
                      <div className="flex items-center border-2 border-gray-200 rounded-lg">
                        <button className="px-4 py-2 hover:bg-gray-100">−</button>
                        <span className="px-6 py-2 font-semibold">1</span>
                        <button className="px-4 py-2 hover:bg-gray-100">+</button>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      disabled={selectedProduct.stock === 0}
                      className="w-full bg-spiritual-maroon text-white py-4 rounded-xl font-bold text-lg hover:bg-spiritual-maroon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>

                    {/* Continue Shopping Button */}
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="w-full bg-gray-100 text-spiritual-ink py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {displayedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No products found in this category. Please browse other categories.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

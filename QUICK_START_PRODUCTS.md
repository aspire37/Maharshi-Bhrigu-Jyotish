# Quick Start: Implement Product Management in 1 Hour

## 5-Step Quick Implementation

### STEP 1: Enable Firebase Storage (5 min)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Storage** in left sidebar
4. Click **Get started** (if not already set up)
5. Choose: **Start in production mode**
6. Select region: **asia-south1** (closest to India, lower latency)
7. Done! ✅

---

### STEP 2: Update Firebase Configuration (5 min)

Edit `src/firebase.ts`:

```typescript
/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // ← ADD THIS

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);  // ← ADD THIS
```

---

### STEP 3: Create useProducts Hook (15 min)

Create `src/hooks/useFirestoreProducts.ts`:

```typescript
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export interface FirestoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  sku: string;
  benefits?: string[];
  featured?: boolean;
  active?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export const useFirestoreProducts = () => {
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const snapshot = await getDocs(collection(db, 'products'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreProduct[];
      setProducts(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch by category
  const fetchByCategory = async (category: string) => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'products'),
        where('category', '==', category),
        where('active', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreProduct[];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Upload image
  const uploadImage = async (file: File, productName: string) => {
    try {
      const sanitizedName = productName.replace(/\s+/g, '-').toLowerCase();
      const timestamp = Date.now();
      const filename = `${sanitizedName}-${timestamp}`;
      const storageRef = ref(storage, `products/${filename}`);
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err: any) {
      throw new Error(`Upload failed: ${err.message}`);
    }
  };

  // Update product
  const updateProduct = async (productId: string, updates: Partial<FirestoreProduct>) => {
    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
      return true;
    } catch (err: any) {
      throw new Error(`Update failed: ${err.message}`);
    }
  };

  // Update price
  const updatePrice = async (productId: string, newPrice: number) => {
    return updateProduct(productId, { price: newPrice });
  };

  // Update stock
  const updateStock = async (productId: string, newStock: number) => {
    return updateProduct(productId, { stock: newStock });
  };

  return {
    products,
    loading,
    error,
    fetchAllProducts,
    fetchByCategory,
    uploadImage,
    updateProduct,
    updatePrice,
    updateStock
  };
};
```

---

### STEP 4: Migrate Products to Firestore (20 min)

Create `src/utils/migrateProducts.ts`:

```typescript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FEATURED_PRODUCTS } from '../constants';

export const migrateProductsToFirestore = async () => {
  console.log('🚀 Starting product migration...');
  
  const productsRef = collection(db, 'products');
  let success = 0;
  let failed = 0;

  for (const product of FEATURED_PRODUCTS) {
    try {
      const docRef = await addDoc(productsRef, {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images,
        stock: product.stock,
        sku: product.sku,
        benefits: product.benefits || [],
        featured: product.featured || false,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ ${product.name} (ID: ${docRef.id})`);
      success++;
    } catch (error) {
      console.error(`❌ Failed: ${product.name}`, error);
      failed++;
    }
  }

  console.log(`\n✅ Migration complete: ${success} products added, ${failed} failed`);
};

// Run this ONCE in your browser console or during app startup:
// import { migrateProductsToFirestore } from './utils/migrateProducts';
// await migrateProductsToFirestore();
```

In your component or App.tsx, run once:

```typescript
// Add this inside useEffect (only once, maybe on admin page)
import { migrateProductsToFirestore } from './utils/migrateProducts';

useEffect(() => {
  // Only run if admin and first time
  if (isAdmin && !localStorage.getItem('products_migrated')) {
    migrateProductsToFirestore().then(() => {
      localStorage.setItem('products_migrated', 'true');
    });
  }
}, [isAdmin]);
```

---

### STEP 5: Update ProductsCatalog Component (15 min)

Update `src/components/ProductsCatalog.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, X } from 'lucide-react';
import { useFirestoreProducts } from '../hooks/useFirestoreProducts';
import { PRODUCT_CATEGORIES } from '../constants';
import { Product } from '../types';

interface ProductCatalogProps {
  onAddToCart?: (product: Product, quantity: number) => void;
}

export const ProductsCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart }) => {
  const { products, loading, error, fetchAllProducts, fetchByCategory } = useFirestoreProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load products on mount
  useEffect(() => {
    if (selectedCategory) {
      fetchByCategory(selectedCategory).then(setDisplayedProducts);
    } else {
      fetchAllProducts().then(setDisplayedProducts);
    }
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spiritual-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchAllProducts}
          className="px-6 py-2 bg-spiritual-maroon text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  src={product.images[0] || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.featured && (
                  <div className="absolute top-4 right-4 bg-spiritual-gold text-spiritual-ink px-3 py-1 rounded-full text-xs font-bold">
                    Featured
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                {/* Price and Stock */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-spiritual-maroon">₹{product.price}</span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}
                  </span>
                </div>

                {/* Benefits */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.benefits.slice(0, 2).map((benefit, idx) => (
                      <span key={idx} className="text-xs bg-spiritual-cream px-2 py-1 rounded">
                        {benefit}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => onAddToCart?.(product as Product, 1)}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-spiritual-maroon text-white py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button className="w-12 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Heart className="w-5 h-5 text-spiritual-gold" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {displayedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};
```

---

## ✅ DONE! You Now Have:

- ✅ Real-time product management
- ✅ Image storage in Firebase
- ✅ Products in Firestore database
- ✅ Can update prices WITHOUT code changes
- ✅ Can update stock levels instantly
- ✅ Can upload new product images anytime

---

## 🎯 Next: Manual Product Upload

### Upload First Batch of Products:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Firestore Database
3. Create collection: `products`
4. Manually add first product as test:
   ```
   Document ID: auto-generate
   Fields:
   - name (string): "Yellow Sapphire (Pukhraj)"
   - description (string): "Natural Yellow Sapphire for prosperity"
   - price (number): 4999
   - category (string): "gemstones"
   - images (array): ["https://your-image-url.jpg"]
   - stock (number): 15
   - sku (string): "PUKHRAJ-001"
   - benefits (array): ["Business Success", "Prosperity"]
   - featured (boolean): true
   - active (boolean): true
   - createdAt (timestamp): now
   - updatedAt (timestamp): now
   ```

5. Click Save ✅
6. Refresh your website - new products will appear!

---

## 💡 Update Pricing (No Code Needed!)

1. Go to Firebase Console
2. Open Firestore Database
3. Find the product
4. Click on `price` field
5. Edit number
6. Save
7. **Website updates instantly!** ✨

---

## 🚀 Next Steps

- [ ] Run migration script (once)
- [ ] Verify products show in website
- [ ] Upload real product images to Storage
- [ ] Create admin dashboard (optional)
- [ ] Test pricing updates
- [ ] Deploy to production

**You're ready to go live!** 🎉

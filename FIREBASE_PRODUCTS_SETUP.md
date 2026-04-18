# Firebase Product Management Implementation

## Quick Setup: Firebase Storage + Firestore

### Step 1: Create Product Management Hook

Create `src/hooks/useProducts.ts`:

```typescript
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsCollection = collection(db, 'products');
      const snapshot = await getDocs(productsCollection);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch products by category
  const fetchByCategory = async (category: string) => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'products'),
        where('category', '==', category),
        where('active', '==', true)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (file: File, productId: string) => {
    try {
      const timestamp = new Date().getTime();
      const filename = `${timestamp}-${file.name}`;
      const storageRef = ref(db, `products/${productId}/${filename}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (err) {
      throw new Error(`Image upload failed: ${err}`);
    }
  };

  // Add new product
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true
      });
      return docRef.id;
    } catch (err) {
      throw new Error(`Failed to add product: ${err}`);
    }
  };

  // Update product
  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (err) {
      throw new Error(`Failed to update product: ${err}`);
    }
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    try {
      // Delete images from storage
      const productRef = ref(db, `products/${productId}`);
      // Note: deleteObject doesn't work on directories, so you'd need to track individual files
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      throw new Error(`Failed to delete product: ${err}`);
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchByCategory,
    uploadImage,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
```

### Step 2: Update Firebase Configuration

Update `src/firebase.ts`:

```typescript
/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

### Step 3: Firestore Security Rules

In Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - public read, admin write
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.uid in ['your-admin-uid-1', 'your-admin-uid-2'];
    }
    
    // Bookings - user can read own bookings
    match /bookings/{document=**} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

### Step 4: Firestore Storage Rules

In Firebase Console → Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      // Publicly readable
      allow read: if true;
      // Only authenticated admin can write
      allow write: if request.auth != null && 
                      request.auth.uid in ['your-admin-uid-1'];
    }
  }
}
```

### Step 5: Modify Product Type

Update `src/types/index.ts`:

```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;  // For sale pricing
  category: 'gemstones' | 'books' | 'spiritual-items' | 'merchandise' | 'gift-sets';
  images: string[];  // Array of image URLs
  primaryImage?: string;
  stock: number;
  sku: string;
  weight?: string;
  dimensions?: string;
  
  // Metadata
  benefits?: string[];
  featured?: boolean;
  active?: boolean;
  rating?: number;
  reviews?: number;
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
}
```

---

## Example: Migrate Hardcoded Products to Firestore

Create a migration script `scripts/migrateProducts.ts`:

```typescript
import { FEATURED_PRODUCTS } from '../src/constants/index';
import { useProducts } from '../src/hooks/useProducts';

export async function migrateProductsToFirestore() {
  const { addProduct } = useProducts();
  
  for (const product of FEATURED_PRODUCTS) {
    try {
      const productData = {
        ...product,
        // Map to new schema
        primaryImage: product.images[0],
        active: true,
        featured: product.featured || false,
      };
      
      const id = await addProduct(productData as any);
      console.log(`✅ Migrated product: ${product.name} (ID: ${id})`);
    } catch (error) {
      console.error(`❌ Failed to migrate ${product.name}:`, error);
    }
  }
}

// Run this once, then remove it
// migrateProductsToFirestore();
```

---

## Example: Admin Dashboard for Products

Create `src/components/AdminProductManager.tsx`:

```typescript
import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

export const AdminProductManager: React.FC = () => {
  const { products, loading, uploadImage, addProduct, updateProduct, deleteProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: 'gemstones' as const,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProduct) return;

    try {
      setUploadingImage(true);
      const url = await uploadImage(file, selectedProduct.id);
      
      // Add to product images
      const updatedImages = [...(selectedProduct.images || []), url];
      await updateProduct(selectedProduct.id, { images: updatedImages });
      
      setSelectedProduct({ ...selectedProduct, images: updatedImages });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePriceUpdate = async (productId: string, newPrice: number) => {
    try {
      await updateProduct(productId, { price: newPrice });
      console.log('✅ Price updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg">
      <h2 className="text-3xl font-bold mb-8">Product Manager</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Products List */}
        <div className="md:col-span-1">
          <h3 className="text-xl font-bold mb-4">Products</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`w-full text-left p-3 rounded ${
                  selectedProduct?.id === product.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <p className="font-bold">{product.name}</p>
                <p className="text-sm">₹{product.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Product Editor */}
        {selectedProduct && (
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Edit: {selectedProduct.name}</h3>
            
            {/* Price Editor */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Price (₹)</label>
              <input
                type="number"
                value={selectedProduct.price}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })}
                onBlur={() => handlePriceUpdate(selectedProduct.id, selectedProduct.price)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Stock Editor */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Stock</label>
              <input
                type="number"
                value={selectedProduct.stock}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: Number(e.target.value) })}
                onBlur={() => updateProduct(selectedProduct.id, { stock: selectedProduct.stock })}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full p-2 border rounded"
              />
              {uploadingImage && <p className="text-blue-500">Uploading...</p>}
            </div>

            {/* Current Images */}
            <div>
              <label className="block text-sm font-bold mb-2">Images</label>
              <div className="grid grid-cols-2 gap-2">
                {selectedProduct.images?.map((img, idx) => (
                  <img key={idx} src={img} alt="Product" className="w-full h-32 object-cover rounded" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## Pricing Strategy: Real-time Updates

Create `src/hooks/usePricing.ts`:

```typescript
import { useState } from 'react';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface PricingRule {
  productId: string;
  basePrice: number;
  discountPercentage?: number;
  discountValidUntil?: Date;
  bulkPricing?: Array<{
    minQuantity: number;
    price: number;
  }>;
}

export const usePricing = () => {
  const [updating, setUpdating] = useState(false);

  // Update product price
  const updatePrice = async (productId: string, newPrice: number) => {
    try {
      setUpdating(true);
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        price: newPrice,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Price update failed:', error);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Set bulk pricing
  const setBulkPricing = async (productId: string, rules: PricingRule['bulkPricing']) => {
    try {
      setUpdating(true);
      const pricingRef = doc(db, 'pricing', productId);
      await setDoc(pricingRef, {
        productId,
        bulkPricing: rules,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Bulk pricing update failed:', error);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Set discount
  const setDiscount = async (
    productId: string, 
    discountPercentage: number, 
    validUntil: Date
  ) => {
    try {
      setUpdating(true);
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        originalPrice: doc(db, 'products', productId), // Store original
        discountPercentage,
        discountValidUntil: validUntil,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Discount update failed:', error);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updating,
    updatePrice,
    setBulkPricing,
    setDiscount
  };
};
```

---

## Integration: Update ProductsCatalog to Use Firebase

Modify `src/components/ProductsCatalog.tsx`:

```typescript
// Add to top of component
import { useProducts } from '../hooks/useProducts';

export const ProductsCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart }) => {
  const { products: firebaseProducts, fetchByCategory, loading } = useProducts();
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

  // Fetch from Firebase instead of constants
  useEffect(() => {
    if (!selectedCategory) {
      // Fetch all products
      fetchByCategory('').then(setDisplayedProducts);
    } else {
      fetchByCategory(selectedCategory).then(setDisplayedProducts);
    }
  }, [selectedCategory, fetchByCategory]);

  if (loading) return <div>Loading products...</div>;

  // Rest of component remains the same
  return (
    // ... existing JSX
  );
};
```

---

## Environment Variables

Add to `.env`:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Testing: Firebase Emulator

```bash
npm install --save-dev firebase-tools

firebase emulators:start
```

Then in `src/firebase.ts` for development:

```typescript
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

---

## Next Steps

1. Update `firebase.ts` with storage import
2. Create `useProducts` hook
3. Migrate products to Firestore manually first
4. Create admin dashboard
5. Update ProductsCatalog component
6. Test with Firebase Emulator
7. Deploy to production

Done! Now you can:
- ✅ Change product details instantly
- ✅ Update pricing without code changes
- ✅ Upload real product images
- ✅ Manage stock levels
- ✅ No deployments needed

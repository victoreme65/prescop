'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  collection, 
  query, 
  limit, 
  startAfter, 
  getDocs, 
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
  where
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/marketplace/product-card';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Filter, Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const db = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFilter = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchProducts = useCallback(async (isInitial = false) => {
    if (isLoading || (!hasMore && !isInitial)) return;

    setIsLoading(true);
    try {
      // Note: This specific composite query (category + createdAt) 
      // requires a manual index in the Firebase console.
      let q = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc'),
        limit(PRODUCTS_PER_PAGE)
      );

      if (categoryFilter) {
        q = query(q, where('category', '==', categoryFilter));
      }

      if (!isInitial && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      
      const newProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      if (isInitial) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      setLastDoc(lastVisible || null);
      setHasMore(snapshot.docs.length === PRODUCTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [db, lastDoc, isLoading, hasMore, categoryFilter]);

  useEffect(() => {
    fetchProducts(true);
  }, [categoryFilter]);

  const lastProductRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchProducts();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, fetchProducts]);

  const removeFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <h1 className="font-headline text-4xl md:text-7xl font-bold tracking-tight">The Marketplace</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Curated beauty selections from Nigeria's most trusted vendors.
              </p>
              {categoryFilter && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                  <Badge className="bg-primary text-white py-1.5 px-4 rounded-full flex items-center gap-2 font-bold text-xs border-none shadow-sm">
                    {categoryFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={removeFilter} />
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full gap-2 border-secondary h-11 px-6 font-bold text-xs bg-white/50">
                <Filter className="h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" className="rounded-full gap-2 border-secondary h-11 px-6 font-bold text-xs bg-white/50">
                <SlidersHorizontal className="h-4 w-4" /> Sort
              </Button>
            </div>
          </div>

          <div className="relative w-full max-w-md group mx-auto md:mx-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-12 h-12 rounded-full bg-secondary/30 border-none focus-visible:ring-primary/50 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product, index) => {
            const isLast = products.length === index + 1;
            return (
              <div key={product.id} ref={isLast ? lastProductRef : null}>
                <ProductCard product={product} />
              </div>
            );
          })}

          {isLoading && [...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square rounded-[2rem] w-full" />
              <div className="space-y-3 px-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && products.length === 0 && (
          <div className="py-24 text-center text-muted-foreground bg-secondary/10 rounded-[3rem] border-2 border-dashed p-12">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-10" />
            <p className="text-xl font-headline italic">No products found.</p>
            <Button variant="link" onClick={removeFilter} className="mt-4 font-bold text-primary">Clear filters</Button>
          </div>
        )}

        {isLoading && products.length > 0 && (
          <div className="flex justify-center mt-12">
            <p className="text-primary animate-pulse font-bold">Loading more treasures...</p>
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <div className="mt-16 text-center py-12 border-t border-secondary/50">
            <p className="text-muted-foreground font-headline text-lg italic opacity-60">
              You've reached the end of the collection.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

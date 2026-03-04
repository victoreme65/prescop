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
  DocumentData
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/marketplace/product-card';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const db = useFirestore();
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
      let q = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc'),
        limit(PRODUCTS_PER_PAGE)
      );

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
  }, [db, lastDoc, isLoading, hasMore]);

  // Initial fetch
  useEffect(() => {
    fetchProducts(true);
  }, []);

  const lastProductRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchProducts();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, fetchProducts]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="flex flex-col gap-6 md:gap-10 mb-10 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Shop Collection</h1>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl">
                Explore our full range of premium beauty essentials, curated for quality and authenticity.
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="outline" size="sm" className="flex-1 md:flex-none rounded-full gap-2 border-secondary h-10 px-5 font-bold text-xs sm:text-sm">
                <Filter className="h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" size="sm" className="flex-1 md:flex-none rounded-full gap-2 border-secondary h-10 px-5 font-bold text-xs sm:text-sm">
                <SlidersHorizontal className="h-4 w-4" /> Sort
              </Button>
            </div>
          </div>

          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search products..." 
              className="pl-11 h-12 rounded-full bg-secondary/30 border-none focus-visible:ring-primary/50 text-sm sm:text-base shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.length > 0 ? (
            products.map((product, index) => {
              if (products.length === index + 1) {
                return (
                  <div ref={lastProductRef} key={product.id}>
                    <ProductCard product={product} />
                  </div>
                );
              } else {
                return <ProductCard key={product.id} product={product} />;
              }
            })
          ) : !isLoading && (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/10 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center p-6">
              <Search className="h-10 w-10 mb-4 opacity-20" />
              <p className="text-lg md:text-xl font-headline italic">No products found. Please check back later.</p>
            </div>
          )}

          {isLoading && [...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square rounded-2xl w-full" />
              <div className="space-y-3 px-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-9 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoading && products.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2 text-primary font-bold animate-pulse">
              <div className="h-2 w-2 rounded-full bg-current" />
              <div className="h-2 w-2 rounded-full bg-current" />
              <div className="h-2 w-2 rounded-full bg-current" />
            </div>
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <div className="mt-16 text-center py-12 border-t border-secondary/50">
            <p className="text-muted-foreground font-headline text-base md:text-lg italic">
              You've reached the end of the collection.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

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

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === PRODUCTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [db, lastDoc, isLoading, hasMore]);

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="flex flex-col gap-8 mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight">Discover Beauty</h1>
              <p className="text-muted-foreground text-base md:text-lg lg:text-xl">Browse our full collection of verified premium products.</p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none rounded-full gap-2 border-secondary h-12 px-6 font-bold">
                <Filter className="h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none rounded-full gap-2 border-secondary h-12 px-6 font-bold">
                <SlidersHorizontal className="h-4 w-4" /> Sort By
              </Button>
            </div>
          </div>

          <div className="relative w-full md:max-w-md lg:max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search products by name or category..." 
              className="pl-12 h-14 rounded-full bg-secondary/30 border-none focus-visible:ring-primary/50 text-base shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
            <div className="col-span-full py-32 text-center text-muted-foreground bg-secondary/10 rounded-[2rem] border-2 border-dashed">
              <p className="text-xl md:text-2xl font-headline italic">No products found. Stay tuned for new arrivals!</p>
            </div>
          )}

          {isLoading && [...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square rounded-3xl w-full" />
              <div className="space-y-3 px-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-10 w-24 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {!hasMore && products.length > 0 && (
          <div className="mt-20 text-center py-16 border-t border-secondary/50">
            <p className="text-muted-foreground font-headline text-lg md:text-xl italic">You've reached the end of our current collection. Follow us for updates!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

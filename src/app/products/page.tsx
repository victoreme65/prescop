'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
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
import { Filter, Search, X, SlidersHorizontal, PackageSearch } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

const PRODUCTS_PER_PAGE = 8;

function ProductsContent() {
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
      let q = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc'),
        limit(PRODUCTS_PER_PAGE)
      );

      if (categoryFilter) {
        q = query(q, where('categoryId', '==', categoryFilter));
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

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="flex flex-col gap-8 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">The Marketplace</h1>
            <p className="text-muted-foreground text-lg max-w-lg italic">
              Premium beauty selections from Nigeria's most trusted vendors.
            </p>
            {categoryFilter && (
              <Badge className="bg-primary text-white py-2 px-5 rounded-full flex items-center gap-3 font-bold text-xs shadow-lg shadow-primary/20 w-fit">
                {categoryFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={removeFilter} />
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-full gap-2 h-12 px-8 font-bold text-xs bg-white/50 backdrop-blur-sm shadow-sm">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" className="rounded-full gap-2 h-12 px-8 font-bold text-xs bg-white/50 backdrop-blur-sm shadow-sm">
              <SlidersHorizontal className="h-4 w-4" /> Sort
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search our luxury collection..." 
            className="pl-14 h-14 rounded-full bg-white border-none shadow-inner focus-visible:ring-primary/40 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
        {filteredProducts.map((product, index) => {
          const isLast = filteredProducts.length === index + 1;
          return (
            <div key={product.id} ref={isLast ? lastProductRef : null}>
              <ProductCard product={product} />
            </div>
          );
        })}

        {(isLoading || products.length === 0) && [...Array(4)].map((_, i) => (
          <div key={i} className="space-y-6">
            <Skeleton className="aspect-square rounded-[3rem] w-full" />
            <div className="space-y-3 px-2">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {!isLoading && filteredProducts.length === 0 && (
        <div className="py-32 text-center text-muted-foreground bg-secondary/10 rounded-[4rem] border-2 border-dashed border-primary/10">
          <PackageSearch className="h-20 w-20 mx-auto mb-6 text-primary opacity-20" />
          <p className="text-2xl font-headline italic">No beauty essentials found matching your search.</p>
          <Button variant="link" onClick={() => {setSearchTerm(''); removeFilter();}} className="mt-4 font-bold text-primary text-lg">Clear all filters</Button>
        </div>
      )}

      {isLoading && products.length > 0 && (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="mt-24 text-center py-12 border-t border-dashed">
          <p className="text-muted-foreground font-headline text-2xl italic">
            You've explored the entire sanctuary.
          </p>
          <Button asChild variant="link" className="mt-4 text-primary font-bold">
            <a href="#top">Back to top</a>
          </Button>
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 container mx-auto px-4 py-32 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-8"></div>
          <p className="font-headline italic text-2xl text-muted-foreground animate-pulse">Opening the marketplace...</p>
        </div>
      }>
        <ProductsContent />
      </Suspense>
      <Footer />
    </div>
  );
}
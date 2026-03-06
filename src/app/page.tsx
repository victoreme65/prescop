
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/marketplace/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, ShieldCheck, Star, BadgeCheck, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { addDoc, collection, serverTimestamp, query, where, limit, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

  // 1. Fetch Featured Products
  const featuredQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'products'),
      where('isFeatured', '==', true),
      limit(4)
    );
  }, [db]);
  const { data: featuredProducts, isLoading: isProductsLoading } = useCollection(featuredQuery);

  // 2. Fetch Categories
  const categoriesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'categories');
  }, [db]);
  const { data: categories, isLoading: isCategoriesLoading } = useCollection(categoriesQuery);

  // 3. Fetch Testimonials
  const testimonialsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'testimonials'), where('isApproved', '==', true), limit(3));
  }, [db]);
  const { data: testimonials, isLoading: isTestimonialsLoading } = useCollection(testimonialsQuery);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    addDoc(collection(db, 'newsletterSubscriptions'), {
      email,
      subscriptionDate: serverTimestamp(),
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      source: 'homepage'
    }).then(() => {
      toast({ title: "Welcome!", description: "You've successfully joined our beauty circle." });
      setEmail('');
    }).catch(() => {
      toast({ variant: "destructive", title: "Oops!", description: "Subscription failed." });
    }).finally(() => setIsSubscribing(false));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative h-[80vh] min-h-[500px] w-full flex items-center overflow-hidden">
          <Image
            src="https://picsum.photos/seed/prescop-hero/1920/1080"
            alt="Premium Beauty Marketplace"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent md:bg-gradient-to-r md:from-background md:via-background/60" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl text-center md:text-left animate-in fade-in slide-in-from-bottom duration-1000">
              <Badge className="mb-6 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border-none">
                #1 Beauty Marketplace Nigeria
              </Badge>
              <h1 className="font-headline text-5xl sm:text-7xl lg:text-8xl font-bold leading-none mb-8 tracking-tighter">
                Shop Premium <br />
                <span className="text-primary italic">Beauty Essentials</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                Discover curated luxury skincare and makeup from Nigeria's most trusted sellers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" asChild className="rounded-full h-14 px-10 bg-primary font-bold shadow-xl shadow-primary/20">
                  <Link href="/products">Shop The Collection</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full h-14 px-10 bg-white/50 backdrop-blur-md font-bold">
                  <Link href="/seller/apply">Become a Seller</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED CATEGORIES */}
        <section className="py-16 md:py-24 bg-secondary/10 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight">Shop Categories</h2>
              <Button asChild variant="link" className="text-primary font-bold hidden md:flex">
                <Link href="/products">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x md:grid md:grid-cols-4">
              {isCategoriesLoading ? (
                [...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-[4/5] rounded-[2.5rem]" />)
              ) : categories && categories.length > 0 ? (
                categories.map((cat: any) => (
                  <Link key={cat.id} href={`/products?category=${cat.name}`} className="min-w-[240px] md:min-w-0 snap-center group">
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-4 border shadow-sm">
                      <Image src={cat.imageUrl || 'https://picsum.photos/seed/placeholder/600/600'} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">{cat.count || '0+'} Items</p>
                        <h3 className="font-headline text-2xl font-bold">{cat.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-10 text-center italic text-muted-foreground">Discover beauty through our diverse categories.</div>
              )}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="py-16 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl md:text-6xl font-bold mb-4 tracking-tight">Trending Essentials</h2>
              <p className="text-muted-foreground text-lg italic">Handpicked favorites from our verified vendors.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {isProductsLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-[2.5rem] w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                ))
              ) : featuredProducts && featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-muted-foreground italic">
                  No featured products available at the moment.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 md:py-32 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-5xl font-bold mb-16 tracking-tight">Community Love</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {isTestimonialsLoading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 rounded-[2rem]" />)
              ) : testimonials && testimonials.length > 0 ? (
                testimonials.map((t: any) => (
                  <div key={t.id} className="p-8 bg-white rounded-[2rem] border shadow-sm">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => <Star key={j} className={`h-4 w-4 ${j < (t.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}
                    </div>
                    <p className="text-muted-foreground mb-6 italic leading-relaxed text-lg">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {t.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm flex items-center gap-1">
                          {t.name} <BadgeCheck className="h-3 w-3 text-primary" />
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">{t.city || 'Nigeria'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center italic text-muted-foreground">Authentic stories from our valued customers.</div>
              )}
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-20 md:py-32 bg-primary text-white text-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <Sparkles className="h-12 w-12 mx-auto mb-6 opacity-60" />
            <h2 className="font-headline text-4xl md:text-7xl font-bold mb-6 tracking-tighter uppercase">Join The Circle</h2>
            <p className="text-lg md:text-2xl opacity-90 mb-12 italic">
              Get 10% off your first order and exclusive beauty tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="Enter your email" 
                className="h-14 rounded-full bg-white/20 border-white/30 text-white placeholder:text-white/60 px-6"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="h-14 rounded-full px-10 bg-white text-primary hover:bg-white/90 font-bold shadow-lg" disabled={isSubscribing}>
                {isSubscribing ? 'Joining...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

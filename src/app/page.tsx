'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/marketplace/product-card';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Star, Send, Heart, BadgeCheck } from 'lucide-react';
import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

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
      toast({ variant: "destructive", title: "Oops!", description: "Subscription failed. Please try again." });
    }).finally(() => setIsSubscribing(false));
  };

  const categories = [
    { name: 'Skincare', count: '450+', image: 'https://picsum.photos/seed/cat-skin/600/600' },
    { name: 'Makeup', count: '320+', image: 'https://picsum.photos/seed/cat-make/600/600' },
    { name: 'Fragrance', count: '180+', image: 'https://picsum.photos/seed/cat-frag/600/600' },
    { name: 'Tools', count: '120+', image: 'https://picsum.photos/seed/cat-tool/600/600' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* 2️⃣ HERO BANNER */}
        <section className="relative h-[85vh] min-h-[500px] w-full flex items-center overflow-hidden">
          <Image
            src="https://picsum.photos/seed/prescop-hero-bg/1920/1080"
            alt="Shop Premium Beauty & Cosmetics in Nigeria"
            fill
            className="object-cover"
            priority
            data-ai-hint="beauty cosmetics"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent md:bg-gradient-to-r md:from-background md:via-background/60" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl text-center md:text-left animate-in fade-in slide-in-from-bottom duration-1000">
              <Badge className="mb-6 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border-none shadow-lg">
                #1 Beauty Marketplace Nigeria
              </Badge>
              <h1 className="font-headline text-4xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-8 tracking-tighter">
                Shop Premium <br />
                <span className="text-primary italic">Beauty & Cosmetics</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                Discover trusted sellers and top beauty brands curated specifically for modern African skin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" asChild className="rounded-full h-14 px-12 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 font-bold text-lg">
                  <Link href="/products">Shop Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full h-14 px-12 border-primary/20 bg-white/40 backdrop-blur-md hover:bg-primary/5 font-bold text-lg">
                  <Link href="/seller/apply">Become a Seller</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ FEATURED CATEGORIES */}
        <section className="py-16 md:py-24 bg-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="font-headline text-3xl md:text-5xl font-bold mb-2 tracking-tight">Shop by Category</h2>
                <p className="text-muted-foreground text-sm md:text-base">Exquisite collections tailored for your needs.</p>
              </div>
              <Button asChild variant="link" className="text-primary font-bold hidden md:flex">
                <Link href="/products">View All</Link>
              </Button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x md:grid md:grid-cols-4 md:overflow-visible">
              {categories.map((cat, i) => (
                <Link key={i} href={`/products?category=${cat.name}`} className="min-w-[200px] md:min-w-0 snap-center group">
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-4 border border-border/50 shadow-sm">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">{cat.count} Products</p>
                      <h3 className="font-headline text-2xl font-bold">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4️⃣ FEATURED PRODUCTS */}
        <section className="py-16 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="font-headline text-4xl md:text-6xl font-bold mb-4 tracking-tight">Featured Essentials</h2>
              <p className="text-muted-foreground text-lg">Most loved products by our beauty community this month.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {MOCK_PRODUCTS.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* 5️⃣ BEST SELLERS Slider (Simplified) */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="font-headline text-3xl md:text-5xl font-bold mb-2 tracking-tight">Best Sellers</h2>
                <p className="text-muted-foreground text-sm">Top rated products with verified reviews.</p>
              </div>
              <Button asChild className="rounded-full bg-primary font-bold">
                <Link href="/products">View All Bestsellers</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {MOCK_PRODUCTS.slice(2, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* 6️⃣ CUSTOMER TESTIMONIALS */}
        <section className="py-16 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-center mb-16 tracking-tight">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Chioma Obi', city: 'Lagos', text: 'Prescop has transformed how I shop for skincare. Every product is verified and works wonders!' },
                { name: 'Zainab Musa', city: 'Abuja', text: 'Finally a reliable place to get authentic international brands in Nigeria. Fast delivery too!' },
                { name: 'Adaeze K.', city: 'Port Harcourt', text: 'The customer support is top-notch. They helped me find the perfect serum for my skin type.' },
              ].map((t, i) => (
                <div key={i} className="p-8 bg-white dark:bg-card rounded-[2rem] shadow-sm border border-secondary relative">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-muted-foreground mb-6 italic italic leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm flex items-center gap-1">
                        {t.name} <BadgeCheck className="h-3 w-3 text-primary" />
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{t.city}, Nigeria</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7️⃣ START SELLING CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[3rem] overflow-hidden bg-[#FDF2F4] p-8 md:p-24 border border-primary/10 text-center md:text-left">
              <div className="max-w-2xl relative z-10 mx-auto md:mx-0">
                <h2 className="font-headline text-3xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">Turn Your Beauty <br /><span className="text-primary italic">Empire Online</span></h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                  Join Nigeria's fastest growing beauty marketplace. Zero setup fees, secure payouts, and express logistics.
                </p>
                <div className="flex flex-wrap gap-6 mb-12 justify-center md:justify-start">
                  {['Zero Setup Fee', 'Secure Payments', 'Fast Withdrawals'].map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span className="font-bold text-sm">{b}</span>
                    </div>
                  ))}
                </div>
                <Button size="lg" asChild className="rounded-full h-14 px-10 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 font-bold text-lg">
                  <Link href="/seller/apply">Apply Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 8️⃣ NEWSLETTER */}
        <section className="py-20 md:py-32 bg-primary text-white overflow-hidden relative">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="font-headline text-3xl md:text-7xl font-bold mb-6 tracking-tighter uppercase">Join the Beauty Circle</h2>
            <p className="text-lg md:text-2xl opacity-90 mb-12 max-w-xl mx-auto italic font-light">
              Get 10% off your first order and exclusive beauty tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input 
                placeholder="Enter your email" 
                className="h-12 rounded-full bg-white/20 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white px-6"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit"
                className="h-12 rounded-full px-10 bg-white text-primary hover:bg-white/90 font-bold shadow-lg"
                disabled={isSubscribing}
              >
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

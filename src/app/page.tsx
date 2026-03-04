'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/marketplace/product-card';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Star, Send, Heart } from 'lucide-react';
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
    { name: 'Skincare', count: '450+ Items', image: 'https://picsum.photos/seed/cat-skin/600/600' },
    { name: 'Makeup', count: '320+ Items', image: 'https://picsum.photos/seed/cat-make/600/600' },
    { name: 'Fragrance', count: '180+ Items', image: 'https://picsum.photos/seed/cat-frag/600/600' },
    { name: 'Tools', count: '120+ Items', image: 'https://picsum.photos/seed/cat-tool/600/600' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[90vh] min-h-[600px] w-full flex items-center overflow-hidden">
          <Image
            src="https://picsum.photos/seed/hero-prescop/1920/1080"
            alt="Shop Premium Beauty in Nigeria"
            fill
            className="object-cover"
            priority
            data-ai-hint="beauty cosmetics"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl animate-in fade-in slide-in-from-left duration-1000">
              <Badge className="mb-6 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border-none shadow-lg">
                Trusted by 10k+ Women
              </Badge>
              <h1 className="font-headline text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] mb-8 tracking-tighter">
                Discover Your <br />
                <span className="text-primary italic">Perfect Glow</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-lg leading-relaxed">
                Shop curated luxury skincare, makeup, and authentic cosmetics from Nigeria's most trusted vendors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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

        {/* Categories */}
        <section className="py-20 md:py-32 bg-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="font-headline text-4xl md:text-6xl font-bold mb-4 tracking-tight">Shop by Category</h2>
              <p className="text-muted-foreground text-lg">Exquisite collections tailored for your unique beauty needs.</p>
            </div>
            
            <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto md:overflow-hidden pb-8 md:pb-0 scrollbar-hide snap-x">
              {categories.map((cat, i) => (
                <Link key={i} href={`/products?category=${cat.name}`} className="min-w-[280px] md:min-w-0 snap-center group">
                  <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden mb-6 border border-border/50 shadow-sm">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-8 left-8 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">{cat.count}</p>
                      <h3 className="font-headline text-3xl font-bold">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="font-headline text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-none">Trending Essentials</h2>
                <p className="text-muted-foreground text-xl leading-relaxed">Most loved products by our beauty community this month.</p>
              </div>
              <Button asChild variant="link" className="text-primary font-bold text-xl h-auto p-0 group self-center md:self-end">
                <Link href="/products" className="flex items-center gap-2">
                  View All Collection <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {MOCK_PRODUCTS.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Seller CTA */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[4rem] overflow-hidden bg-primary/5 p-10 md:p-32 border border-primary/10 text-center md:text-left">
              <div className="max-w-2xl relative z-10 mx-auto md:mx-0">
                <h2 className="font-headline text-4xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">Turn Your Beauty <br /><span className="text-primary italic">Empire Online</span></h2>
                <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
                  Join Nigeria's fastest growing multi-vendor beauty marketplace. Zero setup fees, secure payouts, and express logistics.
                </p>
                <div className="flex flex-wrap gap-8 mb-16 justify-center md:justify-start">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    <span className="font-bold">Secure Escrow</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="h-8 w-8 text-primary" />
                    <span className="font-bold">Nationwide Shipping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="h-8 w-8 text-primary" />
                    <span className="font-bold">24/7 Support</span>
                  </div>
                </div>
                <Button size="lg" asChild className="rounded-full h-16 px-12 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 font-bold text-xl">
                  <Link href="/seller/apply">Apply to Join Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-24 md:py-40 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-20 opacity-10 hidden md:block">
            <Send className="h-64 w-64 -rotate-12" />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="font-headline text-4xl md:text-8xl font-bold mb-8 tracking-tighter">Join the Beauty Circle</h2>
            <p className="text-xl md:text-3xl opacity-90 mb-16 max-w-2xl mx-auto leading-relaxed italic font-light">
              Early access to drops, expert beauty tips, and exclusive member offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input 
                placeholder="Enter your email address" 
                className="h-16 rounded-full bg-white/20 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white text-lg px-8"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit"
                className="h-16 rounded-full px-12 bg-white text-primary hover:bg-white/90 font-bold shadow-2xl text-lg min-w-[180px]"
                disabled={isSubscribing}
              >
                {isSubscribing ? 'Joining...' : 'Subscribe'}
              </Button>
            </form>
            <p className="mt-10 text-sm opacity-60 uppercase tracking-widest font-bold">Zero spam. Pure elegance. Unsubscribe anytime.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

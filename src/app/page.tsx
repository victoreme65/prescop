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
    }).then(() => {
      toast({ title: "Welcome!", description: "You've successfully joined our beauty circle." });
      setEmail('');
    }).catch(() => {
      toast({ variant: "destructive", title: "Oops!", description: "Subscription failed. Please try again." });
    }).finally(() => setIsSubscribing(false));
  };

  const categories = [
    { name: 'Skincare', icon: '✨', count: '450+ Items', image: 'https://picsum.photos/seed/cat-skin/600/600' },
    { name: 'Makeup', icon: '💄', count: '320+ Items', image: 'https://picsum.photos/seed/cat-make/600/600' },
    { name: 'Fragrance', icon: '🌸', count: '180+ Items', image: 'https://picsum.photos/seed/cat-frag/600/600' },
    { name: 'Tools', icon: '💆‍♀️', count: '120+ Items', image: 'https://picsum.photos/seed/cat-tool/600/600' },
  ];

  const testimonials = [
    { name: "Adesuwa E.", comment: "Prescop is my go-to for authentic luxury brands. The delivery is always fast!", city: "Lagos" },
    { name: "Ibrahim K.", comment: "As a seller, Prescop has doubled my reach. The platform is secure and easy to manage.", city: "Abuja" },
    { name: "Chinelo O.", comment: "I love the AI review summaries. It makes choosing products so much easier!", city: "Port Harcourt" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
          <Image
            src="https://picsum.photos/seed/hero-prescop/1920/1080"
            alt="Luxury Beauty"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl animate-in fade-in slide-in-from-left duration-1000">
              <Badge className="mb-4 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border-none">
                Exclusive Collection 2024
              </Badge>
              <h1 className="font-headline text-5xl sm:text-7xl lg:text-9xl font-bold leading-[0.85] mb-6 tracking-tighter">
                Discover Your <br />
                <span className="text-primary italic">Perfect Glow</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                Nigeria's premier multi-vendor destination for curated luxury beauty and authentic cosmetics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="rounded-full h-14 px-10 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 font-bold text-base">
                  <Link href="/products">Shop Collection</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full h-14 px-10 border-primary/30 hover:bg-primary/5 font-bold text-base bg-white/40 backdrop-blur-sm">
                  <Link href="/seller/apply">Sell on Prescop</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories - Horizontal Scroll on Mobile */}
        <section className="py-16 md:py-24 bg-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-headline text-3xl md:text-6xl font-bold mb-2 tracking-tight">Shop by Category</h2>
                <p className="text-muted-foreground">Tailored collections for your unique beauty needs.</p>
              </div>
            </div>
            
            <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-hidden pb-4 md:pb-0 scrollbar-hide snap-x">
              {categories.map((cat, i) => (
                <Link key={i} href={`/products?category=${cat.name}`} className="min-w-[260px] md:min-w-0 snap-center group">
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-4 border border-border/50 shadow-sm">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">{cat.count}</p>
                      <h3 className="font-headline text-2xl font-bold">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="font-headline text-3xl md:text-6xl font-bold mb-4 tracking-tight">Trending Essentials</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">Our community's favorite picks, curated just for you.</p>
              </div>
              <Button asChild variant="link" className="text-primary font-bold text-lg h-auto p-0 group">
                <Link href="/products" className="flex items-center gap-2">
                  View All Products <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Seller CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[4rem] overflow-hidden bg-primary/5 p-8 md:p-24 border border-primary/10">
              <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none hidden lg:block">
                <Sparkles className="h-64 w-64 text-primary" />
              </div>
              <div className="max-w-2xl relative z-10 text-center md:text-left mx-auto md:mx-0">
                <h2 className="font-headline text-3xl md:text-7xl font-bold mb-6 leading-tight">Empower Your <br />Beauty Business</h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                  Join Nigeria's fastest growing multi-vendor beauty marketplace. Scale your brand with zero upfront costs.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span className="font-bold text-sm">Secure Sales</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <Truck className="h-6 w-6 text-primary" />
                    <span className="font-bold text-sm">Logistics Support</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <Heart className="h-6 w-6 text-primary" />
                    <span className="font-bold text-sm">24/7 Expert Help</span>
                  </div>
                </div>
                <Button size="lg" asChild className="rounded-full h-14 px-12 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 font-bold">
                  <Link href="/seller/apply">Apply to Join Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl md:text-6xl font-bold text-center mb-16 tracking-tight">Loved by Our Community</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white dark:bg-card p-10 rounded-[3rem] shadow-sm border border-border/50 flex flex-col h-full">
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-xl italic text-muted-foreground leading-relaxed flex-1 mb-8">"{t.comment}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm flex items-center gap-2">
                        {t.name} <Badge className="text-[10px] bg-green-100 text-green-700 border-none font-bold">Verified Purchase</Badge>
                      </h4>
                      <p className="text-xs text-muted-foreground">{t.city}, Nigeria</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto rounded-[4rem] bg-primary p-12 md:p-32 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 p-8 opacity-10 hidden md:block">
                <Send className="h-56 w-56 -rotate-12" />
              </div>
              <div className="relative z-10">
                <h2 className="font-headline text-4xl md:text-7xl font-bold mb-6 tracking-tighter">Join the Beauty Circle</h2>
                <p className="text-lg md:text-2xl opacity-90 mb-12 max-w-xl mx-auto leading-relaxed">
                  Subscribe for early access to new drops, exclusive tips, and member-only offers.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <Input 
                    placeholder="Enter your email address" 
                    className="h-14 rounded-full bg-white/20 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white h-14"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button 
                    type="submit"
                    className="h-14 rounded-full px-10 bg-white text-primary hover:bg-white/90 font-bold shadow-2xl h-14 min-w-[140px]"
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? 'Joining...' : 'Subscribe'}
                  </Button>
                </form>
                <p className="mt-8 text-xs opacity-60">Zero spam. Pure beauty. Unsubscribe anytime.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
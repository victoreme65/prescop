'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/marketplace/product-card';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Star, Send } from 'lucide-react';
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
      toast({
        title: "Successfully subscribed!",
        description: "You'll now receive our weekly beauty updates.",
      });
      setEmail('');
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: "Something went wrong. Please try again later.",
      });
    }).finally(() => {
      setIsSubscribing(false);
    });
  };

  const testimonials = [
    {
      name: "Adesuwa E.",
      location: "Lagos, Nigeria",
      comment: "Prescop has changed how I buy skincare. The quality is always guaranteed and delivery is so fast!",
      rating: 5,
      image: "https://picsum.photos/seed/testi1/100/100"
    },
    {
      name: "Ibrahim K.",
      location: "Abuja, Nigeria",
      comment: "Finally, a place where I can find authentic international brands and local gems in one place.",
      rating: 5,
      image: "https://picsum.photos/seed/testi2/100/100"
    },
    {
      name: "Chinelo O.",
      location: "Enugu, Nigeria",
      comment: "The customer service is top-notch. I had a small issue with an order and it was resolved in minutes.",
      rating: 5,
      image: "https://picsum.photos/seed/testi3/100/100"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[500px] md:h-[85vh] w-full flex items-center overflow-hidden py-12 md:py-0">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://picsum.photos/seed/prescop-hero-v2/1600/900"
              alt="Beauty Hero"
              fill
              className="object-cover"
              priority
              data-ai-hint="skincare beauty"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background md:bg-gradient-to-r md:from-background md:via-background/70 md:to-transparent" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl animate-in fade-in slide-in-from-left-4 duration-1000 text-center md:text-left">
              <Badge variant="outline" className="mb-4 md:mb-6 border-primary text-primary px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide uppercase">
                New Collection 2024
              </Badge>
              <h1 className="font-headline text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-4 md:mb-6 tracking-tighter">
                Discover Your <br />
                <span className="text-primary italic">Timeless Beauty</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-8 md:mb-10 font-body leading-relaxed max-w-lg mx-auto md:mx-0">
                The ultimate destination for premium skincare, makeup, and fragrances. Curated for the modern African aesthetic.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                <Button size="lg" asChild className="rounded-full h-12 sm:h-14 px-8 sm:px-10 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 text-sm sm:text-base font-bold">
                  <Link href="/products">Shop Collection</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full h-12 sm:h-14 px-8 sm:px-10 border-primary/20 hover:bg-primary/5 text-sm sm:text-base font-bold bg-background/50 backdrop-blur-sm">
                  <Link href="/seller/apply">Start Selling</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              <div className="flex flex-col items-center text-center gap-3 sm:gap-4 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-background shadow-sm border border-border/50 transition-all hover:shadow-md">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg sm:text-xl mb-1 sm:mb-2">Verified Sellers</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">Every product is authenticated and sourced from certified vendors.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3 sm:gap-4 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-background shadow-sm border border-border/50 transition-all hover:shadow-md">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg sm:text-xl mb-1 sm:mb-2">Nationwide Delivery</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">Efficient logistics network covering all 36 states in Nigeria.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3 sm:gap-4 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-background shadow-sm border border-border/50 transition-all hover:shadow-md">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg sm:text-xl mb-1 sm:mb-2">Personalized AI</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">AI-powered recommendations tailored to your unique skin type.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-4">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="font-headline text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-4 tracking-tight">Trending Essentials</h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">Explore our most sought-after beauty essentials, chosen by the Prescop community.</p>
              </div>
              <Button asChild variant="link" className="text-primary font-bold text-sm sm:text-base md:text-lg h-auto p-0 group self-center md:self-end">
                <Link href="/products" className="flex items-center gap-2">
                  View All <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-center tracking-tight">Loved by Thousands</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="p-6 sm:p-8 rounded-[1.5rem] bg-background shadow-sm border border-primary/10 flex flex-col gap-4 sm:gap-6">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-3 w-3 sm:h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base italic text-muted-foreground leading-relaxed">"{t.comment}"</p>
                  <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                    <div className="relative h-10 w-10 sm:h-12 w-12 rounded-full overflow-hidden border border-primary/20 shrink-0">
                      <Image src={t.image} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm md:text-base">{t.name}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto rounded-[2rem] md:rounded-[3rem] bg-primary p-6 sm:p-12 md:p-20 text-center text-primary-foreground relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block">
                <Send className="h-48 w-48 sm:h-64 sm:w-64 rotate-12" />
              </div>
              <div className="relative z-10">
                <h2 className="font-headline text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">Join the Beauty Circle</h2>
                <p className="text-sm sm:text-base md:text-xl opacity-90 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
                  Subscribe to get early access to drops, exclusive beauty tips, and special offers.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                  <Input 
                    placeholder="Enter your email" 
                    className="h-12 sm:h-14 rounded-full bg-white/20 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button 
                    type="submit"
                    className="h-12 sm:h-14 rounded-full px-6 sm:px-8 bg-white text-primary hover:bg-white/90 font-bold shadow-lg"
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? 'Joining...' : 'Subscribe'}
                  </Button>
                </form>
                <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs opacity-60">No spam, unsubscribe anytime.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

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
        <section className="relative min-h-[500px] md:h-[85vh] w-full flex items-center overflow-hidden py-16 md:py-0">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://picsum.photos/seed/prescop-hero-v2/1600/900"
              alt="Beauty Hero"
              fill
              className="object-cover"
              priority
              data-ai-hint="skincare beauty"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 md:via-background/60 to-transparent" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl animate-in fade-in slide-in-from-left-4 duration-1000">
              <Badge variant="outline" className="mb-6 border-primary text-primary px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase">
                New Collection 2024
              </Badge>
              <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 tracking-tighter">
                Discover Your <br />
                <span className="text-primary italic">Timeless Beauty</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 font-body leading-relaxed max-w-lg">
                The ultimate destination for premium skincare, makeup, and fragrances. Curated for the modern African aesthetic.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="rounded-full h-14 px-10 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 text-base font-bold">
                  <Link href="/products">Shop the Collection</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full h-14 px-10 border-primary/20 hover:bg-primary/5 text-base font-bold bg-background/50 backdrop-blur-sm">
                  <Link href="/seller/apply">Start Selling</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
              <div className="flex flex-col items-center text-center gap-4 p-8 rounded-[2rem] bg-background shadow-sm border border-border/50 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg md:text-xl mb-2">Verified Sellers</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Every product is authenticated and sourced from certified beauty vendors.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-4 p-8 rounded-[2rem] bg-background shadow-sm border border-border/50 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Truck className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg md:text-xl mb-2">Nationwide Delivery</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Efficient logistics network covering all 36 states in Nigeria within 3-5 days.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-4 p-8 rounded-[2rem] bg-background shadow-sm border border-border/50 transition-all hover:shadow-md hover:-translate-y-1 sm:col-span-2 md:col-span-1 max-w-md mx-auto sm:max-w-none">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg md:text-xl mb-2">Personalized Curation</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">AI-powered recommendations tailored to your unique skin tone and type.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">Trending This Week</h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">Explore our most sought-after beauty essentials, chosen by the Prescop community.</p>
              </div>
              <Button asChild variant="link" className="text-primary font-bold text-base md:text-lg h-auto p-0 group self-start md:self-auto">
                <Link href="/products" className="flex items-center gap-2">
                  Discover All Products <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-12 md:mb-16 text-center">Loved by Thousands</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-background shadow-sm border border-primary/10 flex flex-col gap-6">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-base md:text-lg italic text-muted-foreground leading-relaxed">"{t.comment}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden border border-primary/20">
                      <Image src={t.image} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base">{t.name}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto rounded-[2rem] md:rounded-[3rem] bg-primary p-10 md:p-20 text-center text-primary-foreground relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-10 hidden md:block">
                <Send className="h-64 w-64 rotate-12" />
              </div>
              <div className="relative z-10">
                <h2 className="font-headline text-3xl sm:text-4xl md:text-6xl font-bold mb-6">Join the Beauty Circle</h2>
                <p className="text-base md:text-xl opacity-90 mb-10 max-w-xl mx-auto leading-relaxed">
                  Subscribe to get early access to drops, exclusive beauty tips, and special offers.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input 
                    placeholder="Enter your email" 
                    className="h-14 rounded-full bg-white/20 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button 
                    type="submit"
                    className="h-14 rounded-full px-8 bg-white text-primary hover:bg-white/90 font-bold shadow-lg"
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? 'Joining...' : 'Subscribe'}
                  </Button>
                </form>
                <p className="mt-6 text-xs md:text-sm opacity-60">No spam, just pure beauty. Unsubscribe anytime.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

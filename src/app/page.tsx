
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
        <section className="relative h-[85vh] min-h-[600px] w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://picsum.photos/seed/prescop-hero-v2/1600/900"
              alt="Beauty Hero"
              fill
              className="object-cover"
              priority
              data-ai-hint="skincare beauty"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl animate-in fade-in slide-in-from-left-4 duration-1000">
              <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1 rounded-full text-sm font-medium">
                New Collection 2024
              </Badge>
              <h1 className="font-headline text-5xl md:text-8xl font-bold leading-tight mb-6 tracking-tighter">
                Discover Your <br />
                <span className="text-primary italic">Timeless Beauty</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 font-body leading-relaxed max-w-lg">
                The ultimate destination for premium skincare, makeup, and fragrances. Curated for the modern African aesthetic.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="rounded-full h-14 px-10 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                  <Link href="/products">Shop the Collection</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full h-14 px-10 border-primary/20 hover:bg-primary/5">
                  <Link href="/seller/apply">Start Selling</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center gap-4 p-8 rounded-[2rem] bg-background shadow-sm border border-border/50 transition-transform hover:-translate-y-1">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-xl mb-2">Verified Sellers</h3>
                  <p className="text-muted-foreground leading-relaxed">Every product is authenticated and sourced from certified beauty vendors.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-4 p-8 rounded-[2rem] bg-background shadow-sm border border-border/50 transition-transform hover:-translate-y-1">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-xl mb-2">Swift Nationwide Delivery</h3>
                  <p className="text-muted-foreground leading-relaxed">Efficient logistics network covering all 36 states in Nigeria within 3-5 days.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-4 p-8 rounded-[2rem] bg-background shadow-sm border border-border/50 transition-transform hover:-translate-y-1">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-xl mb-2">Personalized Curation</h3>
                  <p className="text-muted-foreground leading-relaxed">AI-powered recommendations tailored to your unique skin tone and type.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="font-headline text-4xl md:text-5xl font-bold mb-6">Trending This Week</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">Explore our most sought-after beauty essentials, chosen by the Prescop community.</p>
              </div>
              <Button asChild variant="link" className="text-primary font-bold text-lg h-auto p-0 group">
                <Link href="/products" className="flex items-center gap-2">
                  Discover All Products <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-primary/5">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-4xl md:text-5xl font-bold mb-16 text-center">Loved by Thousands</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] bg-background shadow-sm border border-primary/10 flex flex-col gap-6">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-lg italic text-muted-foreground leading-relaxed">"{t.comment}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image src={t.image} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{t.name}</h4>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto rounded-[3rem] bg-primary p-12 md:p-20 text-center text-primary-foreground relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Send className="h-64 w-64 rotate-12" />
              </div>
              <div className="relative z-10">
                <h2 className="font-headline text-4xl md:text-6xl font-bold mb-6">Join the Beauty Circle</h2>
                <p className="text-lg md:text-xl opacity-90 mb-10 max-w-xl mx-auto leading-relaxed">
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
                <p className="mt-6 text-sm opacity-60">No spam, just pure beauty. Unsubscribe anytime.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: "default" | "outline", className?: string }) {
  const variants = {
    default: "bg-primary text-white",
    outline: "border border-input bg-transparent"
  };
  return (
    <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}

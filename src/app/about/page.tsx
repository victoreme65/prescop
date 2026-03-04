'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ShieldCheck, Sparkles, Users, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-32 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-primary text-white px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs">Our Story</Badge>
            <h1 className="font-headline text-4xl md:text-8xl font-bold mb-8 tracking-tighter">Empowering <span className="text-primary italic">African Beauty</span></h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Prescop is Nigeria's premier multi-vendor marketplace, dedicated to bringing luxury beauty and authentic cosmetics to every doorstep.
            </p>
          </div>
        </section>

        {/* Mission/Vision */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden">
                <Image src="https://picsum.photos/seed/about1/800/800" alt="Beauty Marketplace" fill className="object-cover" />
              </div>
              <div className="space-y-12">
                <div className="space-y-4">
                  <h2 className="font-headline text-3xl md:text-6xl font-bold">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To create a seamless bridge between verified beauty vendors and customers, ensuring authenticity, quality, and a premium shopping experience tailored for the modern African woman.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-bold text-lg">Authenticity</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">We vet every single vendor on our platform to ensure zero counterfeit products.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-bold text-lg">Innovation</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Leveraging AI to provide personalized beauty recommendations for unique skin types.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-bold text-lg">Community</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Supporting local entrepreneurs and growing the Nigerian beauty ecosystem.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-bold text-lg">Excellence</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Committed to world-class service, fast delivery, and premium packaging.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="py-20 md:py-32 bg-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="font-headline text-4xl md:text-7xl font-bold text-primary mb-2">15k+</p>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <p className="font-headline text-4xl md:text-7xl font-bold text-primary mb-2">250+</p>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Verified Vendors</p>
              </div>
              <div>
                <p className="font-headline text-4xl md:text-7xl font-bold text-primary mb-2">10k+</p>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Products Listed</p>
              </div>
              <div>
                <p className="font-headline text-4xl md:text-7xl font-bold text-primary mb-2">36</p>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">States Reached</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Ghost, Home, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-10 animate-in fade-in zoom-in duration-700">
          <div className="relative inline-block">
            <div className="text-[10rem] sm:text-[14rem] font-headline font-bold text-primary/10 leading-none select-none italic">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Ghost className="h-24 w-24 sm:h-36 sm:w-36 text-primary opacity-80" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-headline text-4xl sm:text-6xl font-bold tracking-tight">Beauty Not Found</h1>
            <p className="text-xl text-muted-foreground leading-relaxed italic max-w-sm mx-auto">
              We couldn't find the page you're looking for. It may have vanished into thin air.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild className="rounded-full h-14 px-10 font-bold shadow-xl shadow-primary/20 bg-primary">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full h-14 px-10 border-primary/20 font-bold bg-white/50 backdrop-blur-sm">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" /> Shop Collection
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
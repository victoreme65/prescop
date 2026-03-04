'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Ghost, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative inline-block">
            <div className="text-[8rem] sm:text-[12rem] font-headline font-bold text-primary/10 leading-none select-none italic">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Ghost className="h-20 w-20 sm:h-32 sm:w-32 text-primary opacity-80" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-headline text-3xl sm:text-5xl font-bold tracking-tight">Beauty Not Found</h1>
            <p className="text-lg text-muted-foreground leading-relaxed italic">
              We couldn't find the page you're looking for. It may have vanished into thin air.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild className="rounded-full h-12 px-8 font-bold shadow-lg shadow-primary/20 bg-primary">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full h-12 px-8 border-primary/20 font-bold">
              <Link href="/products">
                Shop All
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

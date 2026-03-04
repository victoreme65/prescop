'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Ghost, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full text-center space-y-12 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="text-[12rem] font-headline font-bold text-primary/10 leading-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Ghost className="h-32 w-32 text-primary opacity-80" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight">Oops! Beauty Lost.</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We couldn't find the page you're looking for. It might have moved or doesn't exist anymore.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="rounded-full h-12 px-8 font-bold shadow-lg shadow-primary/20">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full h-12 px-8 border-primary/20 hover:bg-primary/5 font-bold">
              <Link href="/products">
                Explore Shop
              </Link>
            </Button>
          </div>
          
          <div className="pt-8 flex justify-center">
            <button 
              onClick={() => window.history.back()}
              className="text-sm font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="h-4 w-4" /> Go back to previous page
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

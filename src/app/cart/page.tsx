'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const cartItems = [
    { ...MOCK_PRODUCTS[0], quantity: 1 },
    { ...MOCK_PRODUCTS[1], quantity: 2 },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
  const shipping = 2500;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <h1 className="font-headline text-3xl md:text-6xl font-bold mb-10 md:mb-16 text-center md:text-left tracking-tight">Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          <div className="lg:col-span-8 space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-white dark:bg-card rounded-[2.5rem] border border-secondary/50 shadow-sm">
                  <div className="relative aspect-square sm:h-40 sm:w-40 rounded-3xl overflow-hidden bg-secondary/30 shrink-0 mx-auto sm:mx-0">
                    <Image src={item.images?.[0] || 'https://picsum.photos/seed/placeholder/600/600'} alt={item.title} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-2 text-center sm:text-left">
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
                        <div>
                          <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{item.category}</p>
                          <h3 className="font-headline text-xl sm:text-2xl font-bold line-clamp-1">{item.title}</h3>
                        </div>
                        <p className="font-bold text-xl text-primary">
                          ₦{((item.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-secondary rounded-full overflow-hidden bg-secondary/10 p-1">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-5 text-sm font-bold w-12 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button variant="ghost" size="sm" className="text-destructive gap-2 font-bold hover:bg-destructive/10 h-10 px-6 rounded-full text-xs">
                        <Trash2 className="h-4 w-4" /> <span>Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 md:py-32 bg-secondary/10 rounded-[4rem] border-2 border-dashed">
                <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-20" />
                <p className="text-2xl font-headline mb-10 italic">Your bag is currently empty.</p>
                <Button asChild className="rounded-full px-10 h-14 bg-primary font-bold text-base shadow-xl">
                  <Link href="/products">Explore Our Collection</Link>
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary shrink-0 opacity-60" />
                <span className="text-xs font-bold uppercase tracking-widest leading-tight">100% Authentic Premium Products</span>
              </div>
              <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <Truck className="h-8 w-8 text-primary shrink-0 opacity-60" />
                <span className="text-xs font-bold uppercase tracking-widest leading-tight">Secure & Express Nationwide Delivery</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="p-8 sm:p-10 bg-white dark:bg-card rounded-[3.5rem] border border-secondary/50 shadow-sm lg:sticky lg:top-24">
              <h2 className="font-headline text-2xl sm:text-3xl font-bold mb-10">Order Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-base text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base text-muted-foreground">
                  <span>Standard Shipping</span>
                  <span className="font-bold text-foreground">₦{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-dashed pt-6 flex justify-between font-bold text-2xl text-primary">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full h-14 sm:h-16 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-2xl shadow-primary/25 gap-3">
                Secure Checkout <ArrowRight className="h-6 w-6" />
              </Button>
              
              <p className="text-center text-[10px] text-muted-foreground mt-8 leading-relaxed uppercase tracking-widest font-bold opacity-60">
                Guaranteed safe checkout with <span className="text-[#00c3f7]">Paystack</span>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  // Use property mapping to handle different mock data structures
  const cartItems = [
    { 
      ...MOCK_PRODUCTS[0], 
      quantity: 1, 
      displayImage: MOCK_PRODUCTS[0].images?.[0] || MOCK_PRODUCTS[0].imageUrls?.[0] 
    },
    { 
      ...MOCK_PRODUCTS[1], 
      quantity: 2, 
      displayImage: MOCK_PRODUCTS[1].images?.[0] || MOCK_PRODUCTS[1].imageUrls?.[0] 
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
  const shipping = 2500;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <h1 className="font-headline text-4xl md:text-7xl font-bold mb-10 tracking-tight text-center md:text-left">Your Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-white dark:bg-card rounded-[2.5rem] border border-secondary/50 shadow-sm">
                  <div className="relative aspect-square sm:h-40 sm:w-40 rounded-[1.5rem] overflow-hidden bg-secondary/30 shrink-0">
                    <Image 
                      src={item.displayImage || 'https://picsum.photos/seed/placeholder/400/400'} 
                      alt={item.title} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{item.category}</p>
                          <h3 className="font-headline text-2xl font-bold line-clamp-1">{item.title}</h3>
                          <p className="text-xs text-muted-foreground italic">Verified Seller</p>
                        </div>
                        <p className="font-bold text-xl text-primary shrink-0">
                          ₦{((item.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-secondary rounded-full overflow-hidden bg-secondary/10">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-4 text-sm font-bold w-10 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button variant="ghost" size="sm" className="text-destructive gap-2 font-bold px-4 rounded-full text-[10px] uppercase tracking-widest h-9 hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" /> <span>Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-secondary/30">
                <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-20" />
                <p className="text-2xl font-headline mb-8 italic text-muted-foreground">Your bag is empty.</p>
                <Button asChild className="rounded-full px-8 h-12 bg-primary font-bold shadow-lg">
                  <Link href="/products">Browse Marketplace</Link>
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary shrink-0 opacity-60" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-loose">100% Authentic Luxury Brands</span>
              </div>
              <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                <Truck className="h-8 w-8 text-primary shrink-0 opacity-60" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-loose">Secure Nationwide Delivery</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="p-8 sm:p-10 bg-white dark:bg-card rounded-[3rem] border border-secondary/50 shadow-xl lg:sticky lg:top-24">
              <h2 className="font-headline text-3xl font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-foreground">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-foreground">₦{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-dashed pt-6 flex justify-between font-bold text-2xl text-primary">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 gap-3">
                Secure Checkout <ArrowRight className="h-5 w-5" />
              </Button>
              
              <p className="text-center text-[10px] text-muted-foreground mt-8 uppercase tracking-widest font-bold opacity-60">
                Processed securely via <span className="text-[#00c3f7]">Paystack</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

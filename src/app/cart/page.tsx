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

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 2500;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-16">
        <h1 className="font-headline text-2xl sm:text-3xl md:text-5xl font-bold mb-6 md:mb-12 text-center md:text-left">Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-card rounded-2xl border border-secondary/50 shadow-sm overflow-hidden">
                  <div className="relative aspect-square sm:h-32 sm:w-32 rounded-xl overflow-hidden bg-secondary/30 shrink-0 mx-auto sm:mx-0">
                    <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1 text-center sm:text-left">
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-2">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{item.category}</p>
                          <h3 className="font-headline text-base sm:text-lg font-bold line-clamp-1">{item.title}</h3>
                        </div>
                        <p className="font-bold text-lg text-primary">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-secondary rounded-full overflow-hidden bg-secondary/10">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 text-xs font-bold w-10 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button variant="ghost" size="sm" className="text-destructive gap-1 font-semibold hover:bg-destructive/10 h-8 px-3 rounded-full text-xs">
                        <Trash2 className="h-3.5 w-3.5" /> <span>Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 md:py-24 bg-secondary/10 rounded-[2rem] border-2 border-dashed">
                <ShoppingBag className="h-10 w-10 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-lg sm:text-xl font-headline mb-6 sm:mb-8">Your bag is currently empty</p>
                <Button asChild className="rounded-full px-8 h-12 bg-primary font-bold">
                  <Link href="/products">Browse Collection</Link>
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">100% Authentic Products</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <Truck className="h-6 w-6 text-primary shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">Secure Nationwide Delivery</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="p-6 sm:p-8 bg-white dark:bg-card rounded-[2rem] border border-secondary/50 shadow-sm sticky top-24">
              <h2 className="font-headline text-xl sm:text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-foreground">₦{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-dashed pt-4 flex justify-between font-bold text-lg sm:text-xl text-primary">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full h-12 sm:h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-xl shadow-primary/20 gap-3">
                Secure Checkout <ArrowRight className="h-5 w-5" />
              </Button>
              
              <p className="text-center text-[10px] text-muted-foreground mt-6 leading-relaxed">
                Payments powered by <span className="font-bold text-[#00c3f7]">Paystack</span>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

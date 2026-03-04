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
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <h1 className="font-headline text-3xl md:text-5xl font-bold mb-8 md:mb-12">Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 md:gap-6 p-4 md:p-6 bg-white dark:bg-card rounded-2xl md:rounded-[2rem] border border-secondary/50 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-xl md:rounded-2xl overflow-hidden bg-secondary/30 shrink-0 mx-auto sm:mx-0">
                    <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex flex-col sm:flex-row justify-between gap-2 md:gap-4 mb-4 sm:mb-0">
                      <div>
                        <p className="text-[10px] md:text-xs text-muted-foreground uppercase font-bold mb-1 tracking-wider">{item.category}</p>
                        <h3 className="font-headline text-lg md:text-xl font-bold line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Authenticity Guaranteed</p>
                      </div>
                      <p className="font-bold text-lg text-primary sm:text-right">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border border-secondary rounded-full overflow-hidden bg-secondary/10">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-secondary">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 md:px-4 text-sm font-bold w-10 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-secondary">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button variant="ghost" size="sm" className="text-destructive gap-2 font-semibold hover:bg-destructive/10 h-8 px-3 rounded-full">
                        <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 md:py-24 bg-secondary/10 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed">
                <ShoppingBag className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-6 text-muted-foreground opacity-30" />
                <p className="text-xl font-headline mb-8">Your bag is currently empty</p>
                <Button asChild className="rounded-full px-12 h-14 bg-primary text-base font-bold">
                  <Link href="/products">Browse Collection</Link>
                </Button>
              </div>
            )}

            <div className="hidden sm:grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wide">100% Authentic Products</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wide">Secure Nationwide Delivery</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="p-6 md:p-8 bg-white dark:bg-card rounded-[2rem] border border-secondary/50 shadow-sm">
              <h2 className="font-headline text-2xl font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm md:text-base text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-foreground">₦{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-dashed pt-4 flex justify-between font-bold text-xl md:text-2xl text-primary">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 gap-3 mb-6">
                Secure Checkout <ArrowRight className="h-5 w-5" />
              </Button>
              
              <div className="space-y-4">
                <p className="text-center text-[10px] md:text-xs text-muted-foreground leading-relaxed px-4">
                  All transactions are secure and encrypted. Payments powered by <span className="font-bold text-[#00c3f7]">Paystack</span>.
                </p>
                <div className="flex items-center justify-center gap-4 opacity-40 grayscale">
                  {/* Mock logos for trust */}
                  <div className="h-4 w-12 bg-muted rounded-sm" />
                  <div className="h-4 w-12 bg-muted rounded-sm" />
                  <div className="h-4 w-12 bg-muted rounded-sm" />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 border border-dashed rounded-2xl text-xs md:text-sm text-center text-muted-foreground bg-secondary/5">
              Have a coupon code? You can apply it at checkout.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

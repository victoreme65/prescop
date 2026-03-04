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
        <h1 className="font-headline text-2xl sm:text-3xl md:text-5xl font-bold mb-6 md:mb-12">Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 md:gap-6 p-4 sm:p-6 bg-white dark:bg-card rounded-xl sm:rounded-[2rem] border border-secondary/50 shadow-sm">
                  <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-lg sm:rounded-2xl overflow-hidden bg-secondary/30 shrink-0 mx-auto sm:mx-0">
                    <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex flex-col sm:flex-row justify-between gap-2 md:gap-4 mb-3 sm:mb-0">
                      <div className="text-center sm:text-left">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5 tracking-wider">{item.category}</p>
                        <h3 className="font-headline text-base sm:text-lg md:text-xl font-bold line-clamp-1">{item.title}</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Authenticity Guaranteed</p>
                      </div>
                      <p className="font-bold text-base sm:text-lg text-primary text-center sm:text-right">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 sm:mt-auto">
                      <div className="flex items-center border border-secondary rounded-full overflow-hidden bg-secondary/10">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-secondary">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 text-xs sm:text-sm font-bold w-8 sm:w-10 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-secondary">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button variant="ghost" size="sm" className="text-destructive gap-1 sm:gap-2 font-semibold hover:bg-destructive/10 h-8 px-3 rounded-full text-xs">
                        <Trash2 className="h-3.5 w-3.5" /> <span>Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 md:py-24 bg-secondary/10 rounded-xl sm:rounded-[3rem] border-2 border-dashed">
                <ShoppingBag className="h-10 w-10 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-muted-foreground opacity-30" />
                <p className="text-lg sm:text-xl font-headline mb-6 sm:mb-8">Your bag is currently empty</p>
                <Button asChild className="rounded-full px-8 sm:px-12 h-12 sm:h-14 bg-primary text-sm sm:text-base font-bold">
                  <Link href="/products">Browse Collection</Link>
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-primary/5 rounded-xl sm:rounded-2xl border border-primary/10">
                <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">100% Authentic Products</span>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-primary/5 rounded-xl sm:rounded-2xl border border-primary/10">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">Secure Nationwide Delivery</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="p-6 sm:p-8 bg-white dark:bg-card rounded-xl sm:rounded-[2rem] border border-secondary/50 shadow-sm">
              <h2 className="font-headline text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Order Summary</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex justify-between text-xs sm:text-base text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-base text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-foreground">₦{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-dashed pt-4 flex justify-between font-bold text-lg sm:text-2xl text-primary">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full h-12 sm:h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-base sm:text-lg shadow-xl shadow-primary/20 gap-2 sm:gap-3 mb-4 sm:mb-6">
                Secure Checkout <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              
              <div className="space-y-4">
                <p className="text-center text-[10px] text-muted-foreground leading-relaxed px-2 sm:px-4">
                  All transactions are secure and encrypted. Payments powered by <span className="font-bold text-[#00c3f7]">Paystack</span>.
                </p>
                <div className="flex items-center justify-center gap-3 sm:gap-4 opacity-30 grayscale">
                  <div className="h-3 w-10 bg-muted rounded-sm" />
                  <div className="h-3 w-10 bg-muted rounded-sm" />
                  <div className="h-3 w-10 bg-muted rounded-sm" />
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 p-3 sm:p-4 border border-dashed rounded-xl sm:rounded-2xl text-[10px] sm:text-sm text-center text-muted-foreground bg-secondary/5">
              Have a coupon code? You can apply it at checkout.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

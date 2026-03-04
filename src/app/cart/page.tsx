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
        <h1 className="font-headline text-4xl md:text-7xl font-bold mb-12 md:mb-20 text-center md:text-left tracking-tighter">Your Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          <div className="lg:col-span-8 space-y-8">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-8 p-8 bg-white dark:bg-card rounded-[3rem] border border-secondary/50 shadow-sm transition-hover hover:shadow-xl">
                  <div className="relative aspect-square sm:h-48 sm:w-48 rounded-[2rem] overflow-hidden bg-secondary/30 shrink-0 mx-auto sm:mx-0 shadow-inner">
                    <Image src={item.images[0] || item.imageUrls[0]} alt={item.title} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-2 text-center sm:text-left">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-primary uppercase font-bold tracking-[0.2em]">{item.category}</p>
                          <h3 className="font-headline text-2xl sm:text-3xl font-bold line-clamp-1">{item.title}</h3>
                          <p className="text-xs text-muted-foreground italic">Sold by: {item.sellerName || 'Verified Seller'}</p>
                        </div>
                        <p className="font-bold text-2xl text-primary shrink-0">
                          ₦{((item.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-10">
                      <div className="flex items-center border border-secondary rounded-full overflow-hidden bg-secondary/10 p-1.5">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white shadow-sm">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-6 text-sm font-bold w-14 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white shadow-sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button variant="ghost" size="sm" className="text-destructive gap-2 font-bold hover:bg-destructive/10 h-12 px-8 rounded-full text-xs uppercase tracking-widest">
                        <Trash2 className="h-4 w-4" /> <span>Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 md:py-40 bg-secondary/5 rounded-[4rem] border-2 border-dashed border-secondary/30">
                <ShoppingBag className="h-24 w-24 mx-auto mb-10 text-muted-foreground opacity-20" />
                <p className="text-3xl font-headline mb-12 italic text-muted-foreground">Your bag is currently empty.</p>
                <Button asChild className="rounded-full px-12 h-16 bg-primary font-bold text-lg shadow-2xl">
                  <Link href="/products">Explore Our Collection</Link>
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10">
              <div className="flex items-center gap-6 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10">
                <ShieldCheck className="h-10 w-10 text-primary shrink-0 opacity-60" />
                <span className="text-xs font-bold uppercase tracking-widest leading-loose">100% Authentic Premium Brands Only</span>
              </div>
              <div className="flex items-center gap-6 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10">
                <Truck className="h-10 w-10 text-primary shrink-0 opacity-60" />
                <span className="text-xs font-bold uppercase tracking-widest leading-loose">Secure & Express Nationwide Shipping</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="p-10 sm:p-14 bg-white dark:bg-card rounded-[4rem] border border-secondary/50 shadow-2xl lg:sticky lg:top-28">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold mb-12">Order Summary</h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex justify-between text-lg text-muted-foreground font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg text-muted-foreground font-medium">
                  <span>Standard Shipping</span>
                  <span className="font-bold text-foreground">₦{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-dashed pt-8 flex justify-between font-bold text-3xl text-primary">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full h-16 sm:h-20 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-xl shadow-2xl shadow-primary/25 gap-4">
                Secure Checkout <ArrowRight className="h-6 w-6" />
              </Button>
              
              <div className="text-center space-y-4 mt-12 opacity-60">
                <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest font-bold">
                  Guaranteed safe checkout via <span className="text-[#00c3f7]">Paystack</span>.
                </p>
                <div className="flex justify-center gap-4">
                   <div className="h-4 w-10 bg-muted rounded"></div>
                   <div className="h-4 w-10 bg-muted rounded"></div>
                   <div className="h-4 w-10 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

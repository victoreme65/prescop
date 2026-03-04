
'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <h1 className="font-headline text-4xl font-bold mb-12">Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 p-6 bg-white rounded-3xl border border-secondary/50 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-2xl overflow-hidden bg-secondary/30 shrink-0">
                    <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">{item.category}</p>
                        <h3 className="font-headline text-xl font-bold">{item.title}</h3>
                      </div>
                      <p className="font-bold text-lg">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-secondary rounded-full overflow-hidden">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-4 text-sm font-bold">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button variant="ghost" size="sm" className="text-destructive gap-2 font-medium hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-secondary/10 rounded-[3rem]">
                <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-20" />
                <p className="text-xl font-headline mb-8">Your bag is empty</p>
                <Button asChild className="rounded-full px-12 bg-primary">
                  <Link href="/products">Browse Collection</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="p-8 bg-primary/5 rounded-[3rem] border border-primary/10 sticky top-24">
              <h2 className="font-headline text-2xl font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span>₦{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-xl text-primary">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 gap-2 mb-4">
                Secure Checkout <ArrowRight className="h-5 w-5" />
              </Button>
              <p className="text-center text-xs text-muted-foreground leading-relaxed">
                Payments secured by <span className="font-bold text-[#00c3f7]">Paystack</span>. 
                Express delivery to all states in Nigeria.
              </p>
            </div>

            <div className="p-6 border border-dashed rounded-3xl text-sm text-center text-muted-foreground">
              Have a coupon code? Apply it in the next step.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

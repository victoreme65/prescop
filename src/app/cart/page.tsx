
'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
  const shipping = cart.length > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-10 md:py-20">
        <h1 className="font-headline text-5xl md:text-8xl font-bold mb-12 tracking-tighter">Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-[3rem] border shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-square sm:h-48 sm:w-48 rounded-[2rem] overflow-hidden bg-secondary/30">
                    <Image src={item.images?.[0] || item.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/400/400'} alt={item.title} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-primary uppercase font-bold tracking-[0.2em]">{item.category}</p>
                        <h3 className="font-headline text-3xl font-bold line-clamp-1 leading-tight">{item.title}</h3>
                        <p className="text-[10px] text-muted-foreground italic font-bold uppercase tracking-widest">Verified Vendor</p>
                      </div>
                      <p className="font-bold text-2xl text-primary tracking-tighter">₦{((item.price || 0) * item.quantity).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center justify-between mt-10">
                      <div className="flex items-center border rounded-full overflow-hidden bg-secondary/20 h-12">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-full w-12 rounded-none hover:bg-primary/10"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-6 text-base font-bold w-12 text-center">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-full w-12 rounded-none hover:bg-primary/10"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive font-bold gap-2 text-xs uppercase h-12 px-8 rounded-full hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-secondary/10 rounded-[3rem] border-2 border-dashed border-primary/20">
                <ShoppingBag className="h-20 w-20 mx-auto mb-6 text-primary opacity-20" />
                <p className="text-3xl font-headline mb-10 italic text-muted-foreground">Your shopping bag is empty.</p>
                <Button asChild className="rounded-full px-12 h-16 bg-primary font-bold shadow-xl shadow-primary/20 text-lg"><Link href="/products">Shop Marketplace</Link></Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="flex items-center gap-6 p-10 bg-primary/5 rounded-[3rem] border border-primary/10">
                <ShieldCheck className="h-12 w-12 text-primary opacity-60" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] leading-relaxed">100% Authentic Beauty Guarantee</span>
              </div>
              <div className="flex items-center gap-6 p-10 bg-primary/5 rounded-[3rem] border border-primary/10">
                <Truck className="h-12 w-12 text-primary opacity-60" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] leading-relaxed">Secure Nationwide Delivery</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="p-10 bg-white rounded-[3rem] border shadow-2xl sticky top-24">
              <h2 className="font-headline text-4xl font-bold mb-10 tracking-tighter">Order Summary</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-xs text-muted-foreground font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-foreground">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-bold uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-foreground">₦{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-dashed pt-8 flex justify-between font-bold text-4xl text-primary tracking-tighter">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Button disabled={cart.length === 0} className="w-full h-16 rounded-full bg-primary text-white font-bold text-xl shadow-2xl shadow-primary/20 gap-3">
                Secure Checkout <ArrowRight className="h-6 w-6" />
              </Button>
              
              <p className="text-center text-[10px] text-muted-foreground mt-10 uppercase tracking-widest font-bold">
                Payments secured via <span className="text-[#00c3f7]">Paystack</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary/40 border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="flex flex-col gap-6">
            <Link href="/" className="font-headline text-3xl font-bold text-primary tracking-tight">
              PRESCOP
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-xs">
              Nigeria's premier multi-vendor destination for curated beauty and cosmetics. Experience elegance and care.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-all">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-all">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="sm:pl-4">
            <h4 className="font-headline font-bold text-lg mb-6 uppercase tracking-wider text-foreground">Marketplace</h4>
            <ul className="flex flex-col gap-4 text-sm md:text-base text-muted-foreground">
              <li><Link href="/products?category=Skincare" className="hover:text-primary transition-colors">Skincare</Link></li>
              <li><Link href="/products?category=Makeup" className="hover:text-primary transition-colors">Makeup</Link></li>
              <li><Link href="/products?category=Fragrance" className="hover:text-primary transition-colors">Fragrance</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/seller/apply" className="text-accent font-semibold hover:opacity-80 transition-opacity">Become a Seller</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg mb-6 uppercase tracking-wider text-foreground">Company</h4>
            <ul className="flex flex-col gap-4 text-sm md:text-base text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Info</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg mb-6 uppercase tracking-wider text-foreground">Contact Us</h4>
            <ul className="flex flex-col gap-4 text-sm md:text-base text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Victoria Island, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+234 800 PRESCOP</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>support@prescop.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t text-center text-xs md:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Prescop Limited. All rights reserved. Designed for elegance.</p>
        </div>
      </div>
    </footer>
  );
}

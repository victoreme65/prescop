import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left">
          <div className="space-y-6">
            <Link href="/" className="font-headline text-2xl md:text-3xl font-bold text-primary tracking-tight">
              PRESCOP
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-xs mx-auto sm:mx-0">
              Nigeria's premier multi-vendor destination for curated beauty and cosmetics. Discover elegance in every drop.
            </p>
            <div className="flex gap-4 justify-center sm:justify-start">
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

          <div>
            <h4 className="font-headline font-bold text-lg mb-6 uppercase tracking-wider">Shop Collection</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/products?category=Skincare" className="hover:text-primary transition-colors">Skincare</Link></li>
              <li><Link href="/products?category=Makeup" className="hover:text-primary transition-colors">Makeup</Link></li>
              <li><Link href="/products?category=Fragrance" className="hover:text-primary transition-colors">Fragrance</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/seller/apply" className="text-accent font-bold">Become a Seller</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg mb-6 uppercase tracking-wider">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Prescop</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg mb-6 uppercase tracking-wider">Connect With Us</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start justify-center sm:justify-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Victoria Island, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+234 800 PRESCOP</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>support@prescop.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t text-center text-[10px] md:text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Prescop Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary/20 border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left">
          <div className="space-y-8">
            <Link href="/" className="font-headline text-3xl md:text-5xl font-bold text-primary tracking-tight">
              PRESCOP
            </Link>
            <p className="text-muted-foreground leading-relaxed text-base max-w-xs mx-auto sm:mx-0">
              Nigeria's premier multi-vendor destination for curated luxury beauty and authentic cosmetics.
            </p>
            <div className="flex gap-5 justify-center sm:justify-start">
              <Link href="#" className="h-11 w-11 rounded-full bg-white flex items-center justify-center text-primary shadow-md hover:bg-primary hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-11 w-11 rounded-full bg-white flex items-center justify-center text-primary shadow-md hover:bg-primary hover:text-white transition-all">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-11 w-11 rounded-full bg-white flex items-center justify-center text-primary shadow-md hover:bg-primary hover:text-white transition-all">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-headline font-bold text-xl mb-8 uppercase tracking-widest text-foreground/80">Shop Beauty</h4>
            <ul className="space-y-4 text-base text-muted-foreground font-medium">
              <li><Link href="/products?category=Skincare" className="hover:text-primary transition-colors">Skincare</Link></li>
              <li><Link href="/products?category=Makeup" className="hover:text-primary transition-colors">Makeup</Link></li>
              <li><Link href="/products?category=Fragrance" className="hover:text-primary transition-colors">Fragrance</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/seller/apply" className="text-accent font-bold mt-2 inline-block">Become a Seller</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-xl mb-8 uppercase tracking-widest text-foreground/80">Information</h4>
            <ul className="space-y-4 text-base text-muted-foreground font-medium">
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-xl mb-8 uppercase tracking-widest text-foreground/80">Get In Touch</h4>
            <ul className="space-y-6 text-base text-muted-foreground font-medium">
              <li className="flex items-start justify-center sm:justify-start gap-4">
                <MapPin className="h-6 w-6 text-primary shrink-0 opacity-60" />
                <span>Victoria Island, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-4">
                <Phone className="h-6 w-6 text-primary shrink-0 opacity-60" />
                <span>+234 800 PRESCOP</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-4">
                <Mail className="h-6 w-6 text-primary shrink-0 opacity-60" />
                <span>support@prescop.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t text-center text-xs text-muted-foreground font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Prescop Limited. Curated with elegance for African Beauty.</p>
        </div>
      </div>
    </footer>
  );
}

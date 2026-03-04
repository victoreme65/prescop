'use client';

import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const cartCount = 2;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/95 backdrop-blur-md border-b shadow-sm py-2" : "bg-background py-4"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between h-14 md:h-16">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-headline text-2xl md:text-4xl font-bold text-primary tracking-tighter">
            PRESCOP
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
            <Link href="/products" className="hover:text-primary transition-colors">Marketplace</Link>
            <Link href="/seller/apply" className="hover:text-primary transition-colors">Sell With Us</Link>
            <Link href="/about" className="hover:text-primary transition-colors">Our Story</Link>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-6 flex-1 justify-end">
          <div className="hidden md:flex relative max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search beauty..." className="pl-12 h-11 rounded-full bg-secondary/40 border-none font-medium text-xs" />
          </div>

          <ThemeToggle />
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full bg-secondary/20">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-white font-bold ring-2 ring-background">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full border border-secondary p-0 overflow-hidden">
                  <User className="h-5 w-5 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-3 rounded-[2rem] shadow-2xl border-secondary">
                <DropdownMenuLabel className="font-headline font-bold text-xl mb-2">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/profile" className="py-3 flex items-center gap-3"><User className="h-4 w-4" /> Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/seller/dashboard" className="py-3 flex items-center gap-3"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive py-3"><LogOut className="h-4 w-4" /> Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button variant="ghost" size="icon" className="lg:hidden h-11 w-11 rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden bg-background transition-all duration-500 origin-top pt-20 px-8",
        isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        {/* Accessibility Fix: Hidden Titles for Screen Readers */}
        <h2 className="sr-only">Mobile Navigation</h2>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">Shop Marketplace</p>
            <Link href="/products" className="text-4xl font-bold font-headline">All Products</Link>
            <Link href="/products?category=Skincare" className="text-3xl font-bold font-headline">Skincare</Link>
            <Link href="/products?category=Makeup" className="text-3xl font-bold font-headline">Makeup</Link>
          </div>
          
          <div className="flex flex-col gap-6 pt-10 border-t">
            <Link href="/seller/apply" className="text-3xl font-bold font-headline text-primary">Become a Seller</Link>
            <div className="flex gap-8 mt-4">
              <Link href="/profile" className="flex items-center gap-3 text-lg font-bold"><User className="h-5 w-5" /> Profile</Link>
              <Link href="/seller/dashboard" className="flex items-center gap-3 text-lg font-bold"><LayoutDashboard className="h-5 w-5" /> Panel</Link>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-12 w-12" onClick={() => setIsMenuOpen(false)}>
          <X className="h-8 w-8" />
        </Button>
      </div>
    </nav>
  );
}
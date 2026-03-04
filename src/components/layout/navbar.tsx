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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const cartCount = 2; // Simulated

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled 
        ? "border-b bg-background/90 backdrop-blur-md py-2 shadow-sm" 
        : "bg-background py-4"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-14 md:h-16">
        <div className="flex items-center gap-4 lg:gap-12">
          <Link href="/" className="font-headline text-2xl md:text-3xl font-bold text-primary tracking-tight">
            PRESCOP
          </Link>
          
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Link href="/products" className="hover:text-primary transition-colors">Shop All</Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors outline-none">
                Categories <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-2xl p-2 w-56 shadow-2xl border-secondary">
                <DropdownMenuItem asChild><Link href="/products?category=Skincare">Skincare</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/products?category=Makeup">Makeup</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/products?category=Fragrance">Fragrance</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/seller/apply" className="text-primary hover:opacity-80 transition-opacity">Become Seller</Link>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-6 justify-end flex-1">
          <div className="hidden md:flex relative max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search beauty..." 
              className="pl-12 h-11 rounded-full bg-secondary/40 border-none focus-visible:ring-primary/50 text-xs font-medium"
            />
          </div>

          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 rounded-full" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5" />
          </Button>

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
                <DropdownMenuLabel className="font-headline font-bold text-lg mb-2">My Prescop</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/profile" className="flex items-center gap-4 py-3"><User className="h-4 w-4" /> Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/seller/dashboard" className="flex items-center gap-4 py-3"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive py-3"><LogOut className="h-4 w-4" /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className={cn(
        "absolute inset-x-0 top-full bg-background border-b px-4 py-3 md:hidden transition-all duration-300",
        isSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0 pointer-events-none overflow-hidden"
      )}>
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search items..." className="pl-12 h-11 rounded-full bg-secondary/40 border-none text-xs font-medium" />
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden bg-background/95 backdrop-blur-md transition-all duration-500 origin-top overflow-hidden pt-20 px-8",
        isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">Marketplace</p>
            <Link href="/products" className="text-4xl font-bold font-headline">Shop All</Link>
            <Link href="/products?category=Skincare" className="text-3xl font-bold font-headline">Skincare</Link>
            <Link href="/products?category=Makeup" className="text-3xl font-bold font-headline">Makeup</Link>
            <Link href="/products?category=Fragrance" className="text-3xl font-bold font-headline">Fragrance</Link>
          </div>
          
          <div className="flex flex-col gap-8 pt-10 border-t">
            <Link href="/seller/apply" className="text-3xl font-bold font-headline text-primary">Become a Seller</Link>
            <div className="flex gap-6 mt-4">
              <Link href="/profile" className="flex items-center gap-3 text-lg font-bold"><User className="h-5 w-5" /> Account</Link>
              <Link href="/seller/dashboard" className="flex items-center gap-3 text-lg font-bold"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
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

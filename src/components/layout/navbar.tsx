'use client';

import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X, LayoutDashboard, LogOut, Package } from 'lucide-react';
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
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
        ? "border-b bg-background/95 backdrop-blur-md py-1" 
        : "bg-background py-2 md:py-4"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-12">
          <Link href="/" className="font-headline text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight shrink-0">
            PRESCOP
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold">
            <Link href="/products?category=Skincare" className="hover:text-primary transition-colors">Skincare</Link>
            <Link href="/products?category=Makeup" className="hover:text-primary transition-colors">Makeup</Link>
            <Link href="/products?category=Fragrance" className="hover:text-primary transition-colors">Fragrance</Link>
            <Link href="/seller/apply" className="hover:text-primary transition-colors text-accent">Sell</Link>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search items..." 
              className="pl-10 h-10 rounded-full bg-secondary/40 border-none focus-visible:ring-primary/50 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <ThemeToggle />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-10 w-10"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative h-10 w-10">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-accent font-bold ring-2 ring-background">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full overflow-hidden border border-secondary">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                <DropdownMenuItem asChild className="rounded-lg h-10 px-3 cursor-pointer">
                  <Link href="/profile" className="flex items-center gap-3">
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg h-10 px-3 cursor-pointer">
                  <Link href="/orders" className="flex items-center gap-3">
                    <ShoppingBag className="h-4 w-4" /> My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg h-10 px-3 cursor-pointer">
                  <Link href="/seller/dashboard" className="flex items-center gap-3">
                    <LayoutDashboard className="h-4 w-4" /> Seller Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive rounded-lg h-10 px-3 focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden h-10 w-10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className={cn(
        "absolute inset-x-0 top-full bg-background border-b px-4 py-3 md:hidden transition-all duration-300 overflow-hidden",
        isSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      )}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search beauty essentials..." 
            className="pl-10 h-10 rounded-full bg-secondary/40 border-none focus-visible:ring-primary/50 text-sm"
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-[49] bg-background/80 backdrop-blur-sm lg:hidden animate-in fade-in" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Menu Content */}
      <div className={cn(
        "fixed inset-x-0 top-16 z-50 lg:hidden bg-background border-b shadow-2xl transition-all duration-300 ease-in-out origin-top overflow-hidden",
        isMenuOpen ? "max-h-[85vh] opacity-100 py-6 px-4" : "max-h-0 opacity-0 py-0 px-4"
      )}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Shop Categories</p>
            <Link href="/products?category=Skincare" className="text-lg font-bold px-3 py-3 rounded-xl hover:bg-secondary transition-colors">Skincare</Link>
            <Link href="/products?category=Makeup" className="text-lg font-bold px-3 py-3 rounded-xl hover:bg-secondary transition-colors">Makeup</Link>
            <Link href="/products?category=Fragrance" className="text-lg font-bold px-3 py-3 rounded-xl hover:bg-secondary transition-colors">Fragrance</Link>
          </div>
          
          <div className="flex flex-col gap-1 pt-4 border-t">
            <Link href="/seller/apply" className="text-lg font-bold px-3 py-3 rounded-xl text-accent hover:bg-accent/10 transition-colors">Become a Seller</Link>
            <Link href="/profile" className="flex items-center gap-3 text-lg font-bold px-3 py-3 rounded-xl hover:bg-secondary transition-colors">
              <User className="h-5 w-5 text-muted-foreground" /> My Profile
            </Link>
            <Link href="/orders" className="flex items-center gap-3 text-lg font-bold px-3 py-3 rounded-xl hover:bg-secondary transition-colors">
              <Package className="h-5 w-5 text-muted-foreground" /> My Orders
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

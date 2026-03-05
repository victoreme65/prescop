'use client';

import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, LayoutDashboard, LogOut, ChevronDown, Store } from 'lucide-react';
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const cartCount = 2;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

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
            <Input placeholder="Search beauty..." className="pl-12 h-11 rounded-full bg-secondary/40 border-none font-bold text-xs" />
          </div>

          <ThemeToggle />
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full bg-secondary/20 hover:bg-primary/10 transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-white font-bold ring-2 ring-background">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          <div className="hidden sm:block">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full border border-secondary p-0 overflow-hidden hover:border-primary/50 transition-colors">
                    <User className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-3 rounded-[2rem] shadow-2xl border-secondary">
                  <DropdownMenuLabel className="font-headline font-bold text-2xl mb-2 px-3">My Beauty</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/profile" className="py-3 px-4 flex items-center gap-3 font-bold rounded-xl"><User className="h-4 w-4" /> Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/seller/dashboard" className="py-3 px-4 flex items-center gap-3 font-bold rounded-xl"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive py-3 px-4 font-bold rounded-xl cursor-pointer">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" className="rounded-full font-bold text-[10px] uppercase tracking-widest">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="rounded-full bg-primary text-white font-bold text-[10px] uppercase tracking-widest px-6 h-10 shadow-lg shadow-primary/20">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-11 w-11 rounded-full bg-secondary/20">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-8">
              <SheetHeader className="mb-12">
                <SheetTitle className="font-headline text-4xl font-bold text-primary tracking-tighter text-left">PRESCOP</SheetTitle>
                <SheetDescription className="sr-only">Mobile Navigation Menu</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-6">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b pb-4">Menu</p>
                  <Link href="/products" className="text-5xl font-bold font-headline hover:text-primary transition-colors tracking-tighter">Marketplace</Link>
                  <Link href="/seller/apply" className="text-4xl font-bold font-headline hover:text-primary transition-colors tracking-tighter">Sell With Us</Link>
                  <Link href="/about" className="text-4xl font-bold font-headline hover:text-primary transition-colors tracking-tighter">Our Story</Link>
                </div>
                
                <div className="flex flex-col gap-6 pt-10 border-t">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account</p>
                  {user ? (
                    <div className="flex flex-col gap-4">
                      <Link href="/profile" className="flex items-center gap-4 text-xl font-bold"><User className="h-6 w-6 text-primary" /> My Profile</Link>
                      <Link href="/seller/dashboard" className="flex items-center gap-4 text-xl font-bold"><LayoutDashboard className="h-6 w-6 text-primary" /> Seller Dashboard</Link>
                      <button onClick={handleLogout} className="flex items-center gap-4 text-xl font-bold text-destructive"><LogOut className="h-6 w-6" /> Sign Out</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link href="/login" className="flex items-center gap-4 text-xl font-bold">Login</Link>
                      <Link href="/signup" className="flex items-center gap-4 text-xl font-bold text-primary">Sign Up</Link>
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <Button asChild className="w-full h-16 rounded-full bg-primary font-bold text-lg">
                    <Link href="/products">Shop The Collection</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

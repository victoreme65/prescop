
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3, 
  ArrowLeft,
  Store,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  title: string;
}

export function DashboardSidebar({ items, title }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-white h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8 group">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">PRESCOP</span>
        </Link>
        <div className="mb-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            {title}
          </p>
        </div>
        <nav className="flex flex-col gap-2">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm",
                pathname === item.href 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-primary"
              )}>
                <item.icon className="h-4 w-4" />
                {item.title}
              </div>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t bg-secondary/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
            ZB
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">Zainab Beauty</span>
            <span className="text-[10px] text-muted-foreground">Seller Account</span>
          </div>
        </div>
        <Button variant="outline" className="w-full text-xs rounded-lg border-primary/20 text-primary hover:bg-primary hover:text-white">
          Manage Settings
        </Button>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ShoppingBag, 
  Star, 
  MessageSquare, 
  Mail, 
  BarChart3, 
  Settings, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';

const sidebarItems = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Users', href: '/admin/users', icon: Users },
  { title: 'Sellers', href: '/admin/sellers', icon: Store },
  { title: 'Products', href: '/admin/products', icon: Package },
  { title: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { title: 'Reviews', href: '/admin/reviews', icon: Star },
  { title: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { title: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('prescop_admin_unlocked');
    router.push('/admin/login');
  };

  return (
    <div className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col hidden lg:flex">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-10 group">
          <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter">PRESCOP <span className="text-primary italic">ADMIN</span></span>
        </Link>
        
        <nav className="flex flex-col gap-1.5">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest",
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
        <Button 
          onClick={handleLogout}
          variant="ghost" 
          className="w-full justify-start gap-4 h-12 rounded-xl font-bold text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
}

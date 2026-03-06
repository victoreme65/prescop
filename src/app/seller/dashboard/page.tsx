'use client';

import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Wallet, Plus, Star, Menu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useUser } from '@/firebase';

export default function SellerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUser();

  const sidebarItems = [
    { title: 'Overview', href: '/seller/dashboard', icon: LayoutDashboard },
    { title: 'My Products', href: '/seller/products', icon: Package },
    { title: 'Orders', href: '/seller/orders', icon: ShoppingCart },
    { title: 'Earnings', href: '/seller/earnings', icon: Wallet },
    { title: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
  ];

  const SidebarContent = () => (
    <DashboardSidebar items={sidebarItems} title="Seller Panel" />
  );

  return (
    <div className="flex flex-col lg:flex-row bg-secondary/10 min-h-screen">
      {/* MOBILE HEADER */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40">
        <Link href="/" className="font-headline font-bold text-2xl text-primary tracking-tighter">
          PRESCOP
        </Link>
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SheetHeader className="sr-only">
              <SheetTitle>Seller Menu</SheetTitle>
              <SheetDescription>Navigate your seller dashboard</SheetDescription>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block border-r bg-white">
        <SidebarContent />
      </div>
      
      <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground italic">Welcome back to your store, {user?.displayName || 'Merchant'}.</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 rounded-full h-12 px-8 font-bold gap-2">
            <Link href="/seller/products/new">
              <Plus className="h-4 w-4" /> Add New Product
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {[
            { label: 'Total Earnings', val: '₦450.2k', icon: Wallet, color: 'text-primary' },
            { label: 'Active Orders', val: '12', icon: ShoppingCart, color: 'text-blue-600' },
            { label: 'Live Products', val: '8', icon: Package, color: 'text-green-600' },
            { label: 'Store Rating', val: '4.8', icon: Star, color: 'text-yellow-500' },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[2rem]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{stat.val}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm rounded-[2.5rem]">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-secondary/50">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                        #{1024 + i}
                      </div>
                      <div>
                        <p className="font-bold text-sm">Customer {i}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">₦15,500 • Paid</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none text-[8px] px-2 py-0">PROCESSING</Badge>
                  </div>
                ))}
              </div>
              <Button asChild variant="link" className="w-full mt-6 text-primary font-bold">
                 <Link href="/seller/orders">View All Orders</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2.5rem]">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Performance Stats</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center italic space-y-4">
                <BarChart3 className="h-16 w-16 mx-auto opacity-20" />
                <p className="text-sm">Store traffic analytics will appear here once verified.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

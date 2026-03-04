'use client';

import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Wallet, Plus, Star, Menu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function SellerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40">
        <Link href="/" className="font-headline font-bold text-xl text-primary tracking-tight">
          PRESCOP
        </Link>
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block border-r bg-white">
        <SidebarContent />
      </div>
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold">Welcome back, Zainab!</h1>
            <p className="text-sm text-muted-foreground">Here is what's happening with your store today.</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 rounded-full gap-2 w-full sm:w-auto">
            <Link href="/seller/products/new">
              <Plus className="h-4 w-4" /> Add New Product
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Total Earnings</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦450,200</div>
              <p className="text-[10px] text-green-500 font-bold">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-[10px] text-green-500 font-bold">+5 new today</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Products</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-[10px] text-muted-foreground">3 out of stock</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-[10px] text-muted-foreground">Based on 156 reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-secondary/10 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white border flex items-center justify-center font-bold text-[10px]">
                        #{1024 + i}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">Customer {i}</p>
                        <p className="text-[10px] text-muted-foreground">₦15,000 • 2 items</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-600 border-none text-[10px] whitespace-nowrap">Processing</Badge>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-4 text-primary font-bold text-sm">View All Orders</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Performance Highlights</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px] flex items-center justify-center text-muted-foreground p-6">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Analytics chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


'use client';

import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Wallet, Plus, Star, Menu, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, collectionGroup } from 'firebase/firestore';

export default function SellerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUser();
  const db = useFirestore();

  // Fetch Seller's Products Count
  const productsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, 'products'), where('sellerId', '==', user.uid));
  }, [db, user?.uid]);
  const { data: products } = useCollection(productsQuery);

  // Fetch Seller's Orders (In a real app, you might have an 'orderItems' collection group or orders would have sellerIds)
  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    // Simulating fetching orders relevant to this seller
    return query(collectionGroup(db, 'orders'));
  }, [db, user?.uid]);
  const { data: orders } = useCollection(ordersQuery);

  const sidebarItems = [
    { title: 'Overview', href: '/seller/dashboard', icon: LayoutDashboard },
    { title: 'My Products', href: '/seller/products', icon: Package },
    { title: 'Orders', href: '/seller/orders', icon: ShoppingCart },
    { title: 'Earnings', href: '/seller/earnings', icon: Wallet },
  ];

  const stats = [
    { label: 'Total Earnings', val: '₦0.00', icon: Wallet, color: 'text-primary' },
    { label: 'Active Orders', val: orders?.length?.toString() || '0', icon: ShoppingCart, color: 'text-blue-600' },
    { label: 'Live Products', val: products?.length?.toString() || '0', icon: Package, color: 'text-green-600' },
    { label: 'Store Rating', val: '5.0', icon: Star, color: 'text-yellow-500' },
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
            <SheetHeader className="p-6 border-b">
              <SheetTitle>Seller Menu</SheetTitle>
              <SheetDescription>Manage your beauty business.</SheetDescription>
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
            <h1 className="font-headline text-3xl md:text-4xl font-bold">Seller Dashboard</h1>
            <p className="text-muted-foreground italic">Welcome back, {user?.displayName || 'Merchant'}.</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 rounded-full h-12 px-8 font-bold gap-2">
            <Link href="/seller/products/new">
              <Plus className="h-4 w-4" /> List New Product
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {stats.map((stat, i) => (
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
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-secondary/50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center font-bold text-[8px] shadow-sm uppercase">
                          {order.id.slice(0, 4)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">₦{order.totalAmount?.toLocaleString()}</p>
                          <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">{order.paymentStatus}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none text-[8px] px-2 py-0">{order.deliveryStatus?.toUpperCase() || 'PENDING'}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center italic text-muted-foreground">No recent orders.</div>
                )}
              </div>
              <Button asChild variant="link" className="w-full mt-6 text-primary font-bold">
                 <Link href="/seller/orders">View All Orders</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2.5rem]">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Inventory Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] flex items-center justify-center text-muted-foreground">
              <div className="text-center italic space-y-4">
                <Package className="h-16 w-16 mx-auto opacity-20" />
                <p className="text-sm">Manage your products effectively to grow your sales.</p>
                <Button asChild variant="outline" className="rounded-full h-10 px-6 font-bold text-xs"><Link href="/seller/products">View Inventory</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

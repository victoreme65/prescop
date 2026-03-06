'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Wallet, Plus, Search, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { query, collection, where, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function SellerProductsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const sidebarItems = [
    { title: 'Overview', href: '/seller/dashboard', icon: LayoutDashboard },
    { title: 'My Products', href: '/seller/products', icon: Package },
    { title: 'Orders', href: '/seller/orders', icon: ShoppingCart },
    { title: 'Earnings', href: '/seller/earnings', icon: Wallet },
    { title: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
  ];

  const sellerProductsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'products'),
      where('sellerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user?.uid]);

  const { data: products, isLoading } = useCollection(sellerProductsQuery);

  const filteredProducts = products?.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-secondary/10 min-h-screen">
      <div className="hidden lg:block border-r bg-white">
        <DashboardSidebar items={sidebarItems} title="Seller Panel" />
      </div>
      
      <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold">My Products</h1>
            <p className="text-muted-foreground italic">Manage your beauty listings.</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 rounded-full h-12 px-8 font-bold gap-2">
            <Link href="/seller/products/new">
              <Plus className="h-4 w-4" /> Add New Product
            </Link>
          </Button>
        </div>

        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-white border-b px-8 py-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search your inventory..." 
                className="pl-12 h-11 rounded-full bg-secondary/30 border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/20 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <th className="px-8 py-4 text-left">Product</th>
                    <th className="px-8 py-4 text-left">Category</th>
                    <th className="px-8 py-4 text-left">Price</th>
                    <th className="px-8 py-4 text-left">Stock</th>
                    <th className="px-8 py-4 text-left">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-8 py-4" colSpan={6}><Skeleton className="h-12 w-full rounded-xl" /></td>
                      </tr>
                    ))
                  ) : filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-secondary/5 transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden border">
                              <Image src={p.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/100/100'} alt={p.title} fill className="object-cover" />
                            </div>
                            <span className="font-bold text-sm line-clamp-1">{p.title}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[8px] font-bold px-3">
                            {p.category || p.categoryId}
                          </Badge>
                        </td>
                        <td className="px-8 py-4 font-bold text-sm">₦{(p.price || 0).toLocaleString()}</td>
                        <td className="px-8 py-4 text-sm font-medium">{p.stock} units</td>
                        <td className="px-8 py-4">
                           <Badge className="bg-green-100 text-green-700 border-none text-[8px] font-bold">ACTIVE</Badge>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                                <Eye className="h-4 w-4" />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-accent/10 hover:text-accent">
                                <Edit className="h-4 w-4" />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                             </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                         <div className="flex flex-col items-center gap-4 text-muted-foreground italic">
                            <Package className="h-12 w-12 opacity-20" />
                            <p>No products found in your inventory.</p>
                            <Button asChild variant="link" className="text-primary font-bold"><Link href="/seller/products/new">List your first product</Link></Button>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

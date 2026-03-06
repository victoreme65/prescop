'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ShoppingBag, Truck, Package, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AdminOrdersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const ordersQuery = useMemoFirebase(() => query(collectionGroup(db, 'orders'), orderBy('createdAt', 'desc')), [db]);
  const { data: orders, isLoading } = useCollection(ordersQuery);

  const handleUpdateStatus = async (order: any, newStatus: string) => {
    try {
      // Reconstruct path: /users/{userId}/orders/{orderId}
      const orderRef = doc(db, 'users', order.customerId, 'orders', order.id);
      await updateDoc(orderRef, { deliveryStatus: newStatus });
      toast({ title: "Order Updated", description: `Status changed to ${newStatus}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: "Check permissions or index." });
    }
  };

  const filteredOrders = orders?.filter(o => 
    o.id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Order <span className="text-primary italic">Tracking</span></h1>
          <p className="text-muted-foreground text-lg italic">Monitor global marketplace transactions.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search order ID or email..." 
            className="pl-12 h-12 rounded-full border-none bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="rounded-[3rem] border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/20 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="px-8 py-6 text-left">Order ID</th>
                  <th className="px-8 py-6 text-left">Customer</th>
                  <th className="px-8 py-6 text-left">Amount</th>
                  <th className="px-8 py-6 text-left">Status</th>
                  <th className="px-8 py-6 text-left">Date</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                        <span className="font-bold text-xs font-mono">{order.id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-xs truncate max-w-[150px]">{order.customerEmail}</p>
                    </td>
                    <td className="px-8 py-6 font-bold text-sm text-primary">₦{(order.totalAmount || 0).toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <Badge className={cn(
                        "rounded-full px-3 py-0.5 text-[8px] font-bold uppercase",
                        order.deliveryStatus === 'delivered' ? "bg-green-100 text-green-700" : 
                        order.deliveryStatus === 'shipped' ? "bg-blue-100 text-blue-700" : 
                        order.deliveryStatus === 'cancelled' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                      )}>
                        {order.deliveryStatus || 'processing'}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-bold text-muted-foreground">
                      {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'MMM dd, HH:mm') : 'Recent'}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end">
                        <Select 
                          value={order.deliveryStatus || 'processing'} 
                          onValueChange={(val) => handleUpdateStatus(order, val)}
                        >
                          <SelectTrigger className="w-[120px] h-8 rounded-full text-[10px] font-bold uppercase">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

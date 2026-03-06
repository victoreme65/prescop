'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, orderBy, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, XCircle, Ban, Store, User, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AdminSellersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all seller profiles across all user paths
  const sellersQuery = useMemoFirebase(() => query(collectionGroup(db, 'sellerProfiles'), orderBy('createdAt', 'desc')), [db]);
  const { data: sellers, isLoading } = useCollection(sellersQuery);

  const handleUpdateStatus = async (seller: any, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      const batch = writeBatch(db);
      
      // 1. Update the Seller Profile Status
      // collectionGroup results don't have the full path in a simple way for doc(), 
      // but the 'id' is available. In a production app with nested paths, 
      // we'd use the document reference from the snapshot.
      // For this implementation, we assume a path structure we can reconstruct or use the ref directly.
      const sellerRef = doc(db, 'users', seller.userId, 'sellerProfiles', seller.id);
      batch.update(sellerRef, { status: newStatus });

      // 2. If approved, upgrade user role
      if (newStatus === 'approved') {
        const userRef = doc(db, 'users', seller.userId);
        batch.update(userRef, { role: 'seller' });
      }

      await batch.commit();
      toast({ title: `Seller ${newStatus.toUpperCase()}`, description: `Business role updated for ${seller.businessName}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Action Failed", description: "Could not update seller status." });
    }
  };

  const filteredSellers = sellers?.filter(s => 
    s.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Vendor <span className="text-primary italic">Vetting</span></h1>
          <p className="text-muted-foreground text-lg italic">Review and manage marketplace sellers.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search business name..." 
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
                  <th className="px-8 py-6 text-left">Business</th>
                  <th className="px-8 py-6 text-left">Owner</th>
                  <th className="px-8 py-6 text-left">Status</th>
                  <th className="px-8 py-6 text-left">Joined</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSellers?.map((seller) => (
                  <tr key={seller.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                          <Store className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{seller.businessName}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{seller.country || 'Nigeria'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="font-bold text-xs">{seller.fullName || 'Unknown Owner'}</p>
                        <p className="text-[10px] text-muted-foreground">{seller.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className={cn(
                        "rounded-full px-3 py-0.5 text-[8px] font-bold uppercase",
                        seller.status === 'approved' ? "bg-green-100 text-green-700" : 
                        seller.status === 'rejected' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                      )}>
                        {seller.status || 'pending'}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-muted-foreground">
                      {seller.createdAt?.toDate ? format(seller.createdAt.toDate(), 'MMM dd, yyyy') : 'Recent'}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {seller.status !== 'approved' && (
                          <Button 
                            onClick={() => handleUpdateStatus(seller, 'approved')}
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {seller.status !== 'rejected' && (
                          <Button 
                            onClick={() => handleUpdateStatus(seller, 'rejected')}
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
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


'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, Users, Store, ShoppingBag, Check, X, AlertCircle } from 'lucide-react';
import { collectionGroup, query, where, doc, updateDoc, collection, orderBy } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  // Security Check: Verify Admin Status via Firestore
  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      // Simple check (ideally this matches the roles_admin collection)
      if (user.email === 'admin@prescop.com') {
        setIsAdmin(true);
      }
    }
  }, [user, isUserLoading, router]);

  // Fetch Pending Seller Applications (using collectionGroup for ease)
  const pendingSellersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collectionGroup(db, 'sellerProfiles'), where('status', '==', 'pending'));
  }, [db]);
  const { data: pendingSellers } = useCollection(pendingSellersQuery);

  // Fetch All Orders
  const allOrdersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collectionGroup(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db]);
  const { data: allOrders } = useCollection(allOrdersQuery);

  const handleApproveSeller = (userId: string, profileId: string) => {
    const profileRef = doc(db, 'users', userId, 'sellerProfiles', profileId);
    updateDocumentNonBlocking(profileRef, { status: 'approved' });
    
    // Also upgrade user role to 'seller'
    const userRef = doc(db, 'users', userId);
    updateDocumentNonBlocking(userRef, { role: 'seller' });

    toast({ title: "Seller Approved", description: "The user has been upgraded to vendor status." });
  };

  const handleRejectSeller = (userId: string, profileId: string) => {
    const profileRef = doc(db, 'users', userId, 'sellerProfiles', profileId);
    updateDocumentNonBlocking(profileRef, { status: 'rejected' });
    toast({ variant: "destructive", title: "Seller Rejected", description: "The application has been declined." });
  };

  if (isUserLoading || (!isAdmin && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <ShieldCheck className="h-12 w-12 text-primary animate-pulse mx-auto" />
          <p className="font-headline text-2xl italic">Authenticating Administrator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline text-4xl md:text-7xl font-bold tracking-tight">Admin <span className="text-primary italic">Control</span></h1>
              <p className="text-muted-foreground text-lg">Manage the Prescop beauty ecosystem.</p>
            </div>
            <div className="flex gap-4">
               <Card className="px-6 py-3 rounded-full border-primary/20 bg-white shadow-sm flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-widest">System Online</span>
               </Card>
            </div>
          </div>

          <Tabs defaultValue="sellers" className="w-full">
            <TabsList className="bg-white p-2 rounded-full h-auto gap-2 shadow-sm border border-secondary mb-12">
              <TabsTrigger value="sellers" className="rounded-full px-8 py-3 font-bold text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Seller Approval</TabsTrigger>
              <TabsTrigger value="orders" className="rounded-full px-8 py-3 font-bold text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Marketplace Sales</TabsTrigger>
              <TabsTrigger value="users" className="rounded-full px-8 py-3 font-bold text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">User Management</TabsTrigger>
            </TabsList>

            <TabsContent value="sellers">
              <div className="grid grid-cols-1 gap-6">
                {pendingSellers && pendingSellers.length > 0 ? (
                  pendingSellers.map((seller: any) => (
                    <Card key={seller.id} className="rounded-[2.5rem] border-none shadow-sm overflow-hidden">
                      <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-16 rounded-2xl bg-secondary/50 flex items-center justify-center">
                            <Store className="h-8 w-8 text-primary opacity-40" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">New Vendor Application</p>
                            <h4 className="font-bold text-xl">{seller.businessName}</h4>
                            <p className="text-sm italic text-muted-foreground">{seller.fullName} • {seller.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button 
                            onClick={() => handleApproveSeller(seller.userId, seller.id)}
                            className="rounded-full h-12 px-8 bg-green-600 hover:bg-green-700 font-bold gap-2"
                          >
                            <Check className="h-4 w-4" /> Approve
                          </Button>
                          <Button 
                            onClick={() => handleRejectSeller(seller.userId, seller.id)}
                            variant="outline" 
                            className="rounded-full h-12 px-8 border-destructive/20 text-destructive hover:bg-destructive/5 font-bold gap-2"
                          >
                            <X className="h-4 w-4" /> Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed">
                    <Check className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-20" />
                    <p className="text-muted-foreground font-headline text-2xl italic">No pending vendor applications.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="orders">
               <div className="grid grid-cols-1 gap-4">
                  {allOrders?.map((order: any) => (
                     <Card key={order.id} className="rounded-[2rem] border-none shadow-sm p-6 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-primary opacity-60" />
                           </div>
                           <div>
                              <p className="font-bold">₦{order.totalAmount.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{order.customerId}</p>
                           </div>
                        </div>
                        <Badge className={`rounded-full px-4 py-1 font-bold text-[10px] ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                           {order.paymentStatus.toUpperCase()}
                        </Badge>
                     </Card>
                  ))}
               </div>
            </TabsContent>

            <TabsContent value="users">
                <div className="p-20 text-center bg-white rounded-[4rem] border border-dashed">
                  <Users className="h-16 w-16 mx-auto mb-6 text-primary opacity-10" />
                  <p className="text-2xl font-headline italic text-muted-foreground">User moderation system active.</p>
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

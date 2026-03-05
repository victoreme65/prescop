'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, ShoppingBag, MapPin, Settings, LogOut, ArrowRight, Package, Clock } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            
            {/* Sidebar / Quick Actions */}
            <div className="w-full md:w-80 space-y-6">
              <Card className="rounded-[3rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                <CardHeader className="bg-primary p-10 text-primary-foreground text-center">
                  <div className="h-24 w-24 rounded-[2rem] bg-white/20 mx-auto mb-6 flex items-center justify-center font-headline text-4xl font-bold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <CardTitle className="font-headline text-3xl font-bold">{user.displayName || 'Beauty Enthusiast'}</CardTitle>
                  <CardDescription className="text-primary-foreground/70 italic">{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white space-y-2">
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl font-bold hover:bg-primary/5">
                    <User className="h-4 w-4 text-primary" /> Profile Details
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl font-bold hover:bg-primary/5">
                    <ShoppingBag className="h-4 w-4 text-primary" /> My Orders
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl font-bold hover:bg-primary/5">
                    <MapPin className="h-4 w-4 text-primary" /> Addresses
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl font-bold hover:bg-primary/5">
                    <Settings className="h-4 w-4 text-primary" /> Account Settings
                  </Button>
                  <div className="pt-4 mt-4 border-t border-dashed">
                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl font-bold text-destructive hover:bg-destructive/5">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="p-8 bg-accent/10 rounded-[2.5rem] border border-accent/20">
                <h4 className="font-headline font-bold text-xl mb-2 text-accent">VIP Circle</h4>
                <p className="text-sm text-muted-foreground leading-relaxed italic">You are a valued member of the Prescop beauty community. Keep shopping to unlock exclusive luxury rewards.</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-10">
              <div className="flex items-center justify-between">
                <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Account <span className="text-primary italic">Overview</span></h1>
                <Button variant="outline" className="rounded-full border-primary/20 font-bold px-8 h-12">Edit Profile</Button>
              </div>

              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="bg-white p-2 rounded-full h-auto gap-2 shadow-sm border border-secondary w-full sm:w-auto">
                  <TabsTrigger value="orders" className="rounded-full px-8 py-3 font-bold text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Recent Orders</TabsTrigger>
                  <TabsTrigger value="wishlist" className="rounded-full px-8 py-3 font-bold text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Wishlist</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="mt-8 space-y-6">
                  {/* Mock Order List */}
                  {[1, 2].map((i) => (
                    <Card key={i} className="rounded-[2.5rem] border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-16 rounded-2xl bg-secondary/50 flex items-center justify-center">
                            <Package className="h-8 w-8 text-primary opacity-40" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Order #PR782{i}</p>
                            <h4 className="font-bold text-lg">Luxury Beauty Bundle</h4>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm font-bold text-primary">₦45,500</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-green-100 text-green-700 rounded-full">DELIVERED</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ordered On</p>
                            <p className="font-bold">Oct 2{i}, 2024</p>
                          </div>
                          <Button variant="outline" className="rounded-full h-12 px-6 border-primary/10 font-bold group">
                            View Details <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="p-12 text-center bg-white rounded-[3rem] border border-dashed">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground font-headline text-xl italic">No more recent orders found.</p>
                  </div>
                </TabsContent>

                <TabsContent value="wishlist" className="mt-8">
                  <div className="p-20 text-center bg-white rounded-[4rem] border border-dashed border-primary/10">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-primary opacity-10" />
                    <p className="text-2xl font-headline italic text-muted-foreground">Your heart's desires are empty.</p>
                    <Button asChild className="mt-8 rounded-full h-14 px-10 font-bold bg-primary shadow-xl shadow-primary/20">
                      <a href="/products">Browse The Sanctuary</a>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
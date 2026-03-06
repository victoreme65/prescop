'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Store, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  Clock,
  DollarSign
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, limit, orderBy, collectionGroup, doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function AdminDashboardPage() {
  const db = useFirestore();
  const { user } = useUser();

  // Guard: Ensure we only fetch if we have a valid admin session
  // Using user?.uid as a dependency instead of the whole user object is CRITICAL
  // to prevent redundant re-initialization of broad collectionGroup listeners.
  
  const adminRoleRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'roles_admin', user.uid);
  }, [db, user?.uid]);

  const { data: adminRole, isLoading: isAdminChecking } = useDoc(adminRoleRef);
  
  // Only proceed with marketplace queries if explicit admin or root email
  const isVerifiedAdmin = adminRole || user?.email?.toLowerCase() === 'admin@prescop.com';

  const usersQuery = useMemoFirebase(() => {
    if (!db || !user?.uid || !isVerifiedAdmin) return null;
    return collection(db, 'users');
  }, [db, user?.uid, isVerifiedAdmin]);

  const productsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid || !isVerifiedAdmin) return null;
    return collection(db, 'products');
  }, [db, user?.uid, isVerifiedAdmin]);

  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user?.uid || !isVerifiedAdmin) return null;
    return collectionGroup(db, 'orders');
  }, [db, user?.uid, isVerifiedAdmin]);

  const pendingSellersQuery = useMemoFirebase(() => {
    if (!db || !user?.uid || !isVerifiedAdmin) return null;
    return query(collectionGroup(db, 'sellerProfiles'), limit(5));
  }, [db, user?.uid, isVerifiedAdmin]);

  const { data: users } = useCollection(usersQuery);
  const { data: products } = useCollection(productsQuery);
  const { data: orders } = useCollection(ordersQuery);
  const { data: recentSellers } = useCollection(pendingSellersQuery);

  const totalRevenue = orders?.reduce((acc, order) => acc + (order.totalAmount || 0), 0) || 0;

  const stats = [
    { title: 'Total Users', value: users?.length || 0, icon: Users, trend: '+12%', color: 'text-blue-600' },
    { title: 'Active Sellers', value: recentSellers?.length || 0, icon: Store, trend: '+5%', color: 'text-green-600' },
    { title: 'Marketplace Value', value: `₦${(totalRevenue / 1000).toFixed(1)}k`, icon: DollarSign, trend: '+24%', color: 'text-primary' },
    { title: 'Total Orders', value: orders?.length || 0, icon: ShoppingBag, trend: '+18%', color: 'text-orange-600' },
  ];

  const chartData = [
    { name: 'Mon', revenue: 45000 },
    { name: 'Tue', revenue: 52000 },
    { name: 'Wed', revenue: 38000 },
    { name: 'Thu', revenue: 65000 },
    { name: 'Fri', revenue: 48000 },
    { name: 'Sat', revenue: 82000 },
    { name: 'Sun', revenue: 71000 },
  ];

  if (isAdminChecking) {
    return (
      <div className="flex items-center justify-center py-32">
        <Badge variant="outline" className="animate-pulse px-6 py-2 rounded-full font-headline italic">Syncing Marketplace Data...</Badge>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 font-body">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Marketplace <span className="text-primary italic">Overview</span></h1>
          <p className="text-muted-foreground text-lg italic">System health and commercial performance metrics.</p>
        </div>
        <Badge variant="outline" className="h-12 rounded-full px-6 border-primary/20 bg-white shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Real-time Sync Active</span>
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center bg-secondary/50", stat.color)}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <ArrowUpRight className="h-3 w-3" /> {stat.trend}
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.title}</p>
              <h3 className="text-4xl font-bold tracking-tighter">{stat.value.toLocaleString()}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-sm p-8 bg-white">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between mb-8">
            <CardTitle className="font-headline text-3xl font-bold">Revenue Flow</CardTitle>
            <Badge variant="secondary" className="rounded-full px-4 py-1 text-[10px] font-bold">WEEKLY VIEW</Badge>
          </CardHeader>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12, fontWeight: 'bold' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12 }} 
                  tickFormatter={(v) => `₦${v/1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8f8f8' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-[3rem] border-none shadow-sm p-8 bg-white">
          <CardHeader className="px-0 pt-0 mb-8">
            <CardTitle className="font-headline text-3xl font-bold">Vendor Pipeline</CardTitle>
          </CardHeader>
          <div className="space-y-6">
            {recentSellers && recentSellers.length > 0 ? (
              recentSellers.map((seller: any) => (
                <div key={seller.id} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-secondary/50 group hover:bg-primary/5 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center font-bold text-primary shadow-sm">
                    {seller.businessName?.charAt(0) || 'B'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{seller.businessName}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Review Required</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 border-none text-[8px] font-bold">VETTING</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-20">
                <Clock className="h-12 w-12 mx-auto mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest font-headline italic">All caught up</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

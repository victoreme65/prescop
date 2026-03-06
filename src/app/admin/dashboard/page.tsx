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
  Clock
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy, collectionGroup } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export default function AdminDashboardPage() {
  const db = useFirestore();

  // Fetch Stats Counts
  const { data: users } = useCollection(useMemoFirebase(() => collection(db, 'users'), [db]));
  const { data: products } = useCollection(useMemoFirebase(() => collection(db, 'products'), [db]));
  const { data: orders } = useCollection(useMemoFirebase(() => collectionGroup(db, 'orders'), [db]));

  const pendingSellersQuery = useMemoFirebase(() => 
    query(collectionGroup(db, 'sellerProfiles'), limit(5)), [db]
  );
  const { data: recentSellers } = useCollection(pendingSellersQuery);

  const stats = [
    { title: 'Total Users', value: users?.length || 0, icon: Users, trend: '+12%', color: 'text-blue-600' },
    { title: 'Active Sellers', value: recentSellers?.length || 0, icon: Store, trend: '+5%', color: 'text-green-600' },
    { title: 'Total Products', value: products?.length || 0, icon: Package, trend: '+18%', color: 'text-orange-600' },
    { title: 'Total Orders', value: orders?.length || 0, icon: ShoppingBag, trend: '+24%', color: 'text-primary' },
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

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Marketplace <span className="text-primary italic">Overview</span></h1>
          <p className="text-muted-foreground text-lg">Live system health and commercial performance.</p>
        </div>
        <Badge variant="outline" className="h-12 rounded-full px-6 border-primary/20 bg-white shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Real-time Sync Active</span>
        </Badge>
      </div>

      {/* Stats Grid */}
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

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-sm p-8 bg-white">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between mb-8">
            <CardTitle className="font-headline text-3xl font-bold">Revenue Trends</CardTitle>
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
            <CardTitle className="font-headline text-3xl font-bold">Pending Actions</CardTitle>
          </CardHeader>
          <div className="space-y-6">
            {recentSellers && recentSellers.length > 0 ? (
              recentSellers.map((seller: any) => (
                <div key={seller.id} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-secondary/50">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center font-bold text-primary shadow-sm">
                    {seller.businessName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{seller.businessName}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">New Application</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 border-none text-[8px] font-bold">REVIEW</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-20">
                <Clock className="h-12 w-12 mx-auto mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">All caught up</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

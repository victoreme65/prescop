
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Users, Award, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

export default function AdminAnalyticsPage() {
  const db = useFirestore();

  // 1. Fetch All Orders for Aggregation
  const ordersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collectionGroup(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: orders, isLoading } = useCollection(ordersQuery);

  // 2. Aggregate Revenue by Month
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  });

  const chartData = last6Months.map(month => {
    const monthOrders = orders?.filter(o => {
      const date = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
      return date >= startOfMonth(month) && date <= endOfMonth(month);
    }) || [];

    const revenue = monthOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return {
      name: format(month, 'MMM'),
      revenue,
      orders: monthOrders.length
    };
  });

  // 3. Category Distribution
  const categoryMap: Record<string, number> = {};
  orders?.forEach(order => {
    order.items?.forEach((item: any) => {
      const cat = item.category || 'Beauty';
      categoryMap[cat] = (categoryMap[cat] || 0) + (item.price * item.quantity);
    });
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // 4. Global Stats
  const totalRevenue = orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0;
  const avgOrderValue = orders?.length ? totalRevenue / orders.length : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
        <p className="font-headline text-3xl italic animate-pulse">Aggregating Market Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Sales <span className="text-primary italic">Intelligence</span></h1>
          <p className="text-muted-foreground text-lg italic">Marketplace performance and revenue analytics.</p>
        </div>
        <Badge variant="outline" className="h-12 rounded-full px-6 border-primary/20 bg-white shadow-sm flex items-center gap-3">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Real-time Sync Active</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-[3rem] border-none shadow-sm p-8 bg-white">
          <CardHeader className="px-0 pt-0 mb-8 flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-3xl font-bold">Revenue Flow</CardTitle>
            <DollarSign className="h-6 w-6 text-primary opacity-20" />
          </CardHeader>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-[3rem] border-none shadow-sm p-8 bg-white">
          <CardHeader className="px-0 pt-0 mb-8 flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-3xl font-bold">Category Distribution</CardTitle>
            <Award className="h-6 w-6 text-primary opacity-20" />
          </CardHeader>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                <Tooltip 
                  cursor={{ fill: '#f8f8f8' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 10, 10, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Avg Order Value', value: `₦${avgOrderValue.toLocaleString()}`, icon: ShoppingBag, color: 'text-blue-500' },
          { label: 'Total Sales Count', value: orders?.length || 0, icon: Users, color: 'text-purple-500' },
          { label: 'Gross Marketplace Value', value: `₦${totalRevenue.toLocaleString()}`, icon: Award, color: 'text-orange-500' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-[2.5rem] border-none shadow-sm p-8 bg-white flex items-center gap-6">
            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center bg-secondary/30", stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold tracking-tighter">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Users, Award } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const db = useFirestore();

  const data = [
    { name: 'Jan', revenue: 1200000, orders: 450 },
    { name: 'Feb', revenue: 1500000, orders: 520 },
    { name: 'Mar', revenue: 2100000, orders: 780 },
    { name: 'Apr', revenue: 1800000, orders: 610 },
    { name: 'May', revenue: 2400000, orders: 890 },
    { name: 'Jun', revenue: 2900000, orders: 950 },
  ];

  const categoryData = [
    { name: 'Skincare', value: 4500000 },
    { name: 'Makeup', value: 3200000 },
    { name: 'Fragrance', value: 1800000 },
    { name: 'Tools', value: 1200000 },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Sales <span className="text-primary italic">Intelligence</span></h1>
          <p className="text-muted-foreground text-lg italic">Marketplace performance and revenue analytics.</p>
        </div>
        <Badge variant="outline" className="h-12 rounded-full px-6 border-primary/20 bg-white shadow-sm flex items-center gap-3">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Global Growth: +24%</span>
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
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v) => `₦${v/1000000}M`} />
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
          { label: 'Avg Order Value', value: '₦18,500', icon: ShoppingBag, color: 'text-blue-500' },
          { label: 'Customer LTV', value: '₦42,000', icon: Users, color: 'text-purple-500' },
          { label: 'Top Seller Performance', value: '98%', icon: Award, color: 'text-orange-500' },
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

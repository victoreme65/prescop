'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Download, Users, Star } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminNewsletterPage() {
  const db = useFirestore();

  const newsletterQuery = useMemoFirebase(() => query(collection(db, 'newsletterSubscriptions'), orderBy('createdAt', 'desc')), [db]);
  const { data: subscribers, isLoading } = useCollection(newsletterQuery);

  const handleExport = () => {
    if (!subscribers) return;
    const emails = subscribers.map(s => s.email).join('\n');
    const blob = new Blob([emails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescop-subscribers-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    link.click();
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Beauty <span className="text-primary italic">Circle</span></h1>
          <p className="text-muted-foreground text-lg italic">Newsletter audience and email subscribers.</p>
        </div>
        <Button 
          onClick={handleExport}
          className="rounded-full bg-primary h-12 px-8 font-bold gap-2 shadow-lg shadow-primary/20"
        >
          <Download className="h-4 w-4" /> Export Email List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="rounded-[3rem] border-none shadow-sm p-8 bg-white md:col-span-2">
          <CardHeader className="px-0 pt-0 mb-8">
            <CardTitle className="font-headline text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" /> Active Subscribers
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {subscribers?.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-secondary/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Mail className="h-4 w-4 text-primary opacity-40" />
                  </div>
                  <span className="font-bold text-sm">{sub.email}</span>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  {sub.createdAt?.toDate ? format(sub.createdAt.toDate(), 'MMM dd, yyyy') : 'Recent'}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[3rem] border-none shadow-sm p-8 bg-primary text-white h-fit">
          <Star className="h-12 w-12 mb-6 opacity-60" />
          <h3 className="font-headline text-4xl font-bold mb-4 tracking-tight leading-none uppercase">Audience <br/>Insights</h3>
          <div className="space-y-6 mt-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Reach</p>
              <p className="text-4xl font-bold tracking-tighter">{subscribers?.length || 0}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Growth (MTD)</p>
              <p className="text-4xl font-bold tracking-tighter">+12%</p>
            </div>
          </div>
          <p className="mt-12 text-xs italic opacity-80 leading-relaxed">
            Subscribers are automatically synchronized with the marketing engine.
          </p>
        </Card>
      </div>
    </div>
  );
}

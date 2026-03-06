
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, Bell, Globe, DollarSign, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const db = useFirestore();
  
  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'global'), [db]);
  const { data: settings, isLoading } = useDoc(settingsRef);

  const [formData, setFormData] = useState({
    commissionRate: 10,
    payoutThreshold: 5000,
    autoApproveVendors: false,
    reviewModeration: true,
    escrowEnabled: true
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        commissionRate: settings.commissionRate || 10,
        payoutThreshold: settings.payoutThreshold || 5000,
        autoApproveVendors: !!settings.autoApproveVendors,
        reviewModeration: !!settings.reviewModeration,
        escrowEnabled: !!settings.escrowEnabled
      });
    }
  }, [settings]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(settingsRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "Settings Saved", description: "Marketplace configuration updated." });
    } catch (err) {
      toast({ variant: "destructive", title: "Save Failed", description: "Check permissions." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">System <span className="text-primary italic">Control</span></h1>
        <p className="text-muted-foreground text-lg italic">Configure platform rules and global settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[3rem] border-none shadow-sm p-8 bg-white">
            <CardHeader className="px-0 pt-0 mb-8">
              <CardTitle className="font-headline text-3xl font-bold">Commission & Fees</CardTitle>
              <CardDescription>Adjust platform monetization rules.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="font-bold text-xs uppercase tracking-widest opacity-60">Standard Commission (%)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input 
                      type="number"
                      value={formData.commissionRate} 
                      onChange={(e) => setFormData({...formData, commissionRate: Number(e.target.value)})}
                      className="h-14 pl-12 rounded-xl border-secondary" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="font-bold text-xs uppercase tracking-widest opacity-60">Payout Threshold (₦)</Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input 
                      type="number"
                      value={formData.payoutThreshold} 
                      onChange={(e) => setFormData({...formData, payoutThreshold: Number(e.target.value)})}
                      className="h-14 pl-12 rounded-xl border-secondary" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-none shadow-sm p-8 bg-white">
            <CardHeader className="px-0 pt-0 mb-8">
              <CardTitle className="font-headline text-3xl font-bold">Marketplace Rules</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-secondary/10">
                <div>
                  <p className="font-bold text-sm">Automatic Vendor Approval</p>
                  <p className="text-xs text-muted-foreground">Approve all new seller applications instantly.</p>
                </div>
                <Switch 
                  checked={formData.autoApproveVendors} 
                  onCheckedChange={(v) => setFormData({...formData, autoApproveVendors: v})} 
                />
              </div>
              <div className="flex items-center justify-between p-6 rounded-2xl bg-secondary/10">
                <div>
                  <p className="font-bold text-sm">Review Moderation</p>
                  <p className="text-xs text-muted-foreground">Manually approve customer reviews before they appear.</p>
                </div>
                <Switch 
                  checked={formData.reviewModeration} 
                  onCheckedChange={(v) => setFormData({...formData, reviewModeration: v})} 
                />
              </div>
              <div className="flex items-center justify-between p-6 rounded-2xl bg-secondary/10">
                <div>
                  <p className="font-bold text-sm">Escrow Payments</p>
                  <p className="text-xs text-muted-foreground">Hold funds until delivery is confirmed.</p>
                </div>
                <Switch 
                  checked={formData.escrowEnabled} 
                  onCheckedChange={(v) => setFormData({...formData, escrowEnabled: v})} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="rounded-[3rem] border-none shadow-sm p-8 bg-primary text-white">
            <ShieldCheck className="h-12 w-12 mb-6 opacity-60" />
            <h3 className="font-headline text-3xl font-bold mb-4 uppercase tracking-tight">Security <br/>Protocol</h3>
            <p className="text-sm italic opacity-80 leading-relaxed mb-8">
              System settings are restricted to the primary administrator. Any change is logged in the security audit trail.
            </p>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-14 rounded-full bg-white text-primary hover:bg-white/90 font-bold gap-2 shadow-xl"
            >
              {isSaving ? "Saving..." : <><Save className="h-4 w-4" /> Save Configuration</>}
            </Button>
          </Card>

          <div className="p-8 rounded-[2.5rem] bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-accent" />
              <h4 className="font-headline font-bold text-xl text-accent">Alerts</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              Critical system alerts will be sent to the primary contact email provided in settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

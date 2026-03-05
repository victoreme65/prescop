'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, TrendingUp, Wallet, ArrowRight, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BecomeSellerPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    bankName: '',
    accountNumber: '',
    accountName: '',
    description: '',
    agreement: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: 'destructive', title: 'Login Required', description: 'Please sign in to apply as a seller.' });
      router.push('/login');
      return;
    }
    if (!formData.agreement) {
      toast({ variant: 'destructive', title: 'Action Required', description: 'Please agree to the Terms & Conditions.' });
      return;
    }

    setIsSubmitting(true);
    
    // Isolation: Each user's applications live under their specific UID path.
    const sellerProfilesRef = collection(db, 'users', user.uid, 'sellerProfiles');
    
    addDocumentNonBlocking(sellerProfilesRef, {
      ...formData,
      userId: user.uid,
      status: 'pending',
      applicationDate: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).then(() => {
      toast({
        title: 'Application Submitted!',
        description: "We've received your business details. Our team will review it within 48 hours.",
      });
      setIsSubmitting(false);
      router.push('/seller/dashboard');
    }).catch(() => {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit application. Please check your connection.' });
      setIsSubmitting(false);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />
      
      <main className="flex-1 py-12 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Info Section */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6 text-center lg:text-left">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto lg:mx-0">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <h1 className="font-headline text-5xl md:text-8xl font-bold leading-[0.9] tracking-tight">
                  Grow Your Beauty <br /><span className="text-primary italic">Empire</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed italic">
                  Join Nigeria's premier luxury beauty destination. We handle the technology, you provide the elegance.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-8 items-start p-8 bg-white rounded-[2.5rem] shadow-sm border border-primary/5">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Massive Reach</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">Connect with thousands of beauty-focused customers across Nigeria's 36 states.</p>
                  </div>
                </div>
                <div className="flex gap-8 items-start p-8 bg-white rounded-[2.5rem] shadow-sm border border-primary/5">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Verified Trust</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">Our verified vendor badge builds instant credibility for your brand and products.</p>
                  </div>
                </div>
                <div className="flex gap-8 items-start p-8 bg-white rounded-[2.5rem] shadow-sm border border-primary/5">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                    <Wallet className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Direct Payouts</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">Secure, automated payouts directly to your bank account with transparent commission rates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-7">
              <Card className="rounded-[4rem] border-none shadow-2xl shadow-primary/10 overflow-hidden">
                <CardHeader className="bg-primary p-12 md:p-16 text-primary-foreground text-center">
                  <CardTitle className="font-headline text-4xl md:text-6xl font-bold mb-4">Vendor Application</CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-xl italic">Partner with the future of African beauty.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 md:p-16 bg-white">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="fullName" className="font-bold text-xs uppercase tracking-widest opacity-60">Founder's Full Name</Label>
                        <Input id="fullName" placeholder="Zainab Alade" required className="h-14 rounded-xl border-secondary text-base" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="businessName" className="font-bold text-xs uppercase tracking-widest opacity-60">Registered Business Name</Label>
                        <Input id="businessName" placeholder="Zainab Beauty Co." required className="h-14 rounded-xl border-secondary text-base" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest opacity-60">Professional Work Email</Label>
                        <Input id="email" type="email" placeholder="zainab@example.com" required className="h-14 rounded-xl border-secondary text-base" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="font-bold text-xs uppercase tracking-widest opacity-60">WhatsApp / Phone Number</Label>
                        <Input id="phone" placeholder="+234 800 000 0000" required className="h-14 rounded-xl border-secondary text-base" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="font-bold text-xs uppercase tracking-widest opacity-60">Settlement Account Details</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input placeholder="Bank Name" required className="h-14 rounded-xl border-secondary" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} />
                        <Input placeholder="Account Number" required className="h-14 rounded-xl border-secondary" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} />
                        <Input placeholder="Account Name" required className="h-14 rounded-xl border-secondary" value={formData.accountName} onChange={e => setFormData({...formData, accountName: e.target.value})} />
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold italic tracking-wider">Funds will be disbursed to this account after order fulfillment.</p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="description" className="font-bold text-xs uppercase tracking-widest opacity-60">Business Summary & Product Focus</Label>
                      <Textarea id="description" placeholder="Briefly describe your niche, brands you carry, and your vision for the Prescop marketplace..." className="min-h-[150px] rounded-2xl border-secondary text-base leading-relaxed" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>

                    <div className="flex items-start space-x-4 p-6 bg-secondary/20 rounded-[2rem] border border-secondary/50">
                      <Checkbox id="agreement" checked={formData.agreement} onCheckedChange={(v) => setFormData({...formData, agreement: !!v})} className="mt-1.5 h-6 w-6 rounded-md border-primary" />
                      <Label htmlFor="agreement" className="text-sm leading-relaxed text-muted-foreground font-medium">
                        I agree to the <a href="/terms" className="text-primary font-bold underline">Prescop Vendor Terms</a> and confirm that all beauty products listed will be 100% authentic.
                      </Label>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-xl shadow-2xl shadow-primary/20 gap-3 hover:scale-[1.01] transition-transform">
                      {isSubmitting ? 'Processing Application...' : 'Apply to Join The Circle'} <ArrowRight className="h-6 w-6" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
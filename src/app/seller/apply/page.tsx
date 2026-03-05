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
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, TrendingUp, Wallet, ArrowRight } from 'lucide-react';
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
    
    // Each user gets their own seller profile record
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
        description: "We've received your application. Our team will review it within 48 hours.",
      });
      setIsSubmitting(false);
      router.push('/seller/dashboard');
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />
      
      <main className="flex-1 py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Info Section */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-6 text-center lg:text-left">
                <h1 className="font-headline text-4xl md:text-7xl font-bold leading-tight tracking-tight">
                  Grow Your Beauty <br /><span className="text-primary italic">Empire</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Join Nigeria's most trusted multi-vendor marketplace. We provide the tools, you provide the elegance.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-6 items-start p-6 bg-white rounded-3xl shadow-sm border border-border/50">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Massive Reach</h3>
                    <p className="text-sm text-muted-foreground">Access thousands of customers nationwide looking for premium beauty products.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start p-6 bg-white rounded-3xl shadow-sm border border-border/50">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Secure Ecosystem</h3>
                    <p className="text-sm text-muted-foreground">Advanced fraud protection and verified reviews build trust for your brand.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start p-6 bg-white rounded-3xl shadow-sm border border-border/50">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Fast Payouts</h3>
                    <p className="text-sm text-muted-foreground">Get your earnings directly into your bank account with lightning-fast withdrawals.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-7">
              <Card className="rounded-[3rem] border-none shadow-2xl shadow-primary/10 overflow-hidden">
                <CardHeader className="bg-primary p-10 md:p-14 text-primary-foreground">
                  <CardTitle className="font-headline text-3xl md:text-5xl font-bold mb-2">Vendor Application</CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-lg">Tell us about your beauty business.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 md:p-14 bg-white">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="font-bold text-xs uppercase tracking-widest opacity-60">Full Name</Label>
                        <Input id="fullName" placeholder="Zainab Alade" required className="h-12 rounded-xl" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessName" className="font-bold text-xs uppercase tracking-widest opacity-60">Business Name</Label>
                        <Input id="businessName" placeholder="Zainab Beauty Co." required className="h-12 rounded-xl" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest opacity-60">Work Email</Label>
                        <Input id="email" type="email" placeholder="zainab@example.com" required className="h-12 rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-bold text-xs uppercase tracking-widest opacity-60">Phone Number</Label>
                        <Input id="phone" placeholder="+234 800 000 0000" required className="h-12 rounded-xl" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold text-xs uppercase tracking-widest opacity-60">Bank Details for Payouts</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input placeholder="Bank Name" required className="h-12 rounded-xl" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} />
                        <Input placeholder="Account Number" required className="h-12 rounded-xl" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} />
                        <Input placeholder="Account Name" required className="h-12 rounded-xl" value={formData.accountName} onChange={e => setFormData({...formData, accountName: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="font-bold text-xs uppercase tracking-widest opacity-60">Business Description</Label>
                      <Textarea id="description" placeholder="Briefly describe what you sell (Brands, categories...)" className="min-h-[120px] rounded-2xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox id="agreement" checked={formData.agreement} onCheckedChange={(v) => setFormData({...formData, agreement: !!v})} className="mt-1" />
                      <Label htmlFor="agreement" className="text-sm leading-relaxed text-muted-foreground">
                        I agree to the Prescop Seller Terms & Conditions and understand that my business must meet quality standards.
                      </Label>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 gap-3">
                      {isSubmitting ? 'Submitting Application...' : 'Apply to Join'} <ArrowRight className="h-5 w-5" />
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

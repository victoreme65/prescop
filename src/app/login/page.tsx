'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      initiateEmailSignIn(auth, email, password);
      toast({ title: "Welcome back!", description: "Signing you in to Prescop." });
      router.push('/');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <Card className="w-full max-w-md rounded-[3rem] border-none shadow-2xl shadow-primary/10 overflow-hidden">
          <CardHeader className="bg-primary p-10 text-primary-foreground text-center">
            <Sparkles className="h-10 w-10 mx-auto mb-4 opacity-60" />
            <CardTitle className="font-headline text-4xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg italic">Sign in to your beauty sanctuary.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 md:p-12 bg-white">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest opacity-60">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-12 h-14 rounded-xl border-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="font-bold text-xs uppercase tracking-widest opacity-60">Password</Label>
                  <Link href="#" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-12 h-14 rounded-xl border-secondary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 gap-3">
                Sign In <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground font-medium mb-4 italic">New to Prescop?</p>
              <Button variant="outline" asChild className="w-full h-14 rounded-full border-primary/20 font-bold hover:bg-primary/5">
                <Link href="/signup">Create Beauty Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

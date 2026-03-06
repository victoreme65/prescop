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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth, useFirestore } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, Mail, Lock, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Create Auth User
      const userCredential = await initiateEmailSignUp(auth, email, password);
      const user = userCredential.user;

      // 2. Initialize "Default Database" - Provision the User Profile
      // This document serves as the root for all private user data
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        id: user.uid,
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
        email: email,
        role: 'customer',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({ title: "Account Created!", description: "Welcome to the Prescop beauty circle." });
      router.push('/');
    } catch (err: any) {
      console.error(err);
      let message = "An unexpected error occurred. Please try again.";
      
      if (err.code === 'auth/email-already-in-use') {
        message = "An account with this email already exists.";
      } else if (err.code === 'auth/weak-password') {
        message = "Password is too weak. Please use at least 6 characters.";
      } else if (err.code === 'auth/invalid-email') {
        message = "Invalid email address format.";
      }

      setError(message);
      toast({ 
        variant: "destructive", 
        title: "Signup Failed", 
        description: message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <Card className="w-full max-w-md rounded-[3rem] border-none shadow-2xl shadow-primary/10 overflow-hidden">
          <CardHeader className="bg-primary p-10 text-primary-foreground text-center">
            <Sparkles className="h-10 w-10 mx-auto mb-4 opacity-60" />
            <CardTitle className="font-headline text-4xl font-bold tracking-tight">Join Prescop</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg italic">Discover the art of authentic beauty.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 md:p-12 bg-white">
            {error && (
              <Alert variant="destructive" className="mb-6 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold text-xs uppercase tracking-widest opacity-60">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="Amaka Obi" 
                    className="pl-12 h-14 rounded-xl border-secondary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest opacity-60">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="amaka@example.com" 
                    className="pl-12 h-14 rounded-xl border-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold text-xs uppercase tracking-widest opacity-60">Password</Label>
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
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 gap-3"
              >
                {isLoading ? (
                  <>Creating Account <Loader2 className="h-5 w-5 animate-spin" /></>
                ) : (
                  <>Create Account <ArrowRight className="h-5 w-5" /></>
                )}
              </Button>
            </form>
            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground font-medium mb-4 italic">Already have an account?</p>
              <Button variant="outline" asChild className="w-full h-14 rounded-full border-primary/20 font-bold hover:bg-primary/5">
                <Link href="/login">Sign In Instead</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

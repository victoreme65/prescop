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
import { useAuth } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      await initiateEmailSignIn(auth, email, password);
      toast({ title: "Welcome back!", description: "Signed in successfully." });
      router.push('/');
    } catch (err: any) {
      console.error(err);
      let message = "An unexpected error occurred. Please try again.";
      
      if (err.code === 'auth/invalid-credential') {
        message = "Invalid email or password. Please check your credentials.";
      } else if (err.code === 'auth/user-not-found') {
        message = "No account found with this email.";
      } else if (err.code === 'auth/wrong-password') {
        message = "Incorrect password. Please try again.";
      } else if (err.code === 'auth/too-many-requests') {
        message = "Too many failed attempts. Please try again later.";
      }

      setError(message);
      toast({ 
        variant: "destructive", 
        title: "Login Failed", 
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
            <CardTitle className="font-headline text-4xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg italic">Sign in to your beauty sanctuary.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 md:p-12 bg-white">
            {error && (
              <Alert variant="destructive" className="mb-6 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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
                    disabled={isLoading}
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
                  <>Signing In <Loader2 className="h-5 w-5 animate-spin" /></>
                ) : (
                  <>Sign In <ArrowRight className="h-5 w-5" /></>
                )}
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

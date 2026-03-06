'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth, useFirestore } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'Pres12.#cop@26';
  const ADMIN_EMAIL = 'admin@prescop.com';

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Handle the specific "admin" username mapping
      const targetEmail = email === ADMIN_USER ? ADMIN_EMAIL : email;
      const isRootAdmin = (email === ADMIN_USER || email === ADMIN_EMAIL) && password === ADMIN_PASS;

      let user;
      try {
        const userCred = await initiateEmailSignIn(auth, targetEmail, password);
        user = userCred.user;
      } catch (signInErr: any) {
        // 2. Auto-provision the root admin if credentials match but user doesn't exist yet
        if (isRootAdmin && (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential')) {
          const userCred = await initiateEmailSignUp(auth, ADMIN_EMAIL, ADMIN_PASS);
          user = userCred.user;
        } else {
          throw signInErr;
        }
      }

      // 3. Ensure the admin role record exists for the root admin in the database
      if (isRootAdmin && user) {
        // Essential: Write this BEFORE redirecting to ensure security rules pass on the next page
        await setDoc(doc(db, 'roles_admin', user.uid), {
          id: user.uid,
          email: ADMIN_EMAIL,
          role: 'admin',
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Ensure the user profile is also marked as admin
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: ADMIN_EMAIL,
          firstName: 'System',
          lastName: 'Administrator',
          role: 'admin',
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
      
      toast({ title: "Identity Verified", description: "Welcome to the Command Center." });
      sessionStorage.setItem('prescop_admin_unlocked', 'true');
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError("Unauthorized. Check your admin credentials and access level.");
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid admin credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/20 font-body">
      <Card className="w-full max-w-md rounded-[3rem] border-none shadow-2xl overflow-hidden">
        <CardHeader className="bg-primary p-12 text-primary-foreground text-center">
          <ShieldCheck className="h-16 w-16 mx-auto mb-6 opacity-60" />
          <CardTitle className="font-headline text-5xl font-bold tracking-tight mb-2 uppercase">Prescop <span className="italic">Admin</span></CardTitle>
          <CardDescription className="text-primary-foreground/70 text-lg italic">Platform security gateway.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 md:p-14 bg-white">
          {error && (
            <Alert variant="destructive" className="mb-8 rounded-2xl animate-in slide-in-from-top-2 border-none bg-red-50 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold">Security Alert</AlertTitle>
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-8">
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-[0.2em] opacity-60 ml-1">Admin Identity</Label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="admin" 
                  className="h-16 pl-14 rounded-2xl border-secondary text-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-[0.2em] opacity-60 ml-1">Security Key</Label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  className="h-16 pl-14 rounded-2xl border-secondary text-lg font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-16 rounded-full bg-primary text-white font-bold text-xl shadow-2xl shadow-primary/20 gap-3 hover:scale-[1.02] transition-transform"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Authorize Access <ArrowRight className="h-6 w-6" /></>}
            </Button>
          </form>

          <p className="mt-12 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
            Protected by <span className="text-primary italic">Prescop Protocol</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

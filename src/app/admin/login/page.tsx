'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Prompt specifically asked for username 'admin'. We map this to admin@prescop.com
      const targetEmail = email === 'admin' ? 'admin@prescop.com' : email;
      
      await initiateEmailSignIn(auth, targetEmail, password);
      
      toast({ title: "Auth Success", description: "Admin identity verified." });
      sessionStorage.setItem('prescop_admin_unlocked', 'true');
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError("Unauthorized access. Check admin credentials.");
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid admin credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/20">
      <Card className="w-full max-w-md rounded-[3rem] border-none shadow-2xl overflow-hidden">
        <CardHeader className="bg-primary p-12 text-primary-foreground text-center">
          <ShieldCheck className="h-16 w-16 mx-auto mb-6 opacity-60" />
          <CardTitle className="font-headline text-5xl font-bold tracking-tight mb-2">Prescop <span className="italic">Admin</span></CardTitle>
          <CardDescription className="text-primary-foreground/70 text-lg italic">Command center authentication.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 md:p-14 bg-white">
          {error && (
            <Alert variant="destructive" className="mb-8 rounded-2xl animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Security Breach</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-8">
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-[0.2em] opacity-60 ml-1">Admin ID</Label>
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
              <Label className="font-bold text-xs uppercase tracking-[0.2em] opacity-60 ml-1">Access Key</Label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  className="h-16 pl-14 rounded-2xl border-secondary text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-16 rounded-full bg-primary text-white font-bold text-xl shadow-2xl shadow-primary/20 gap-3"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Authorize Access <ArrowRight className="h-6 w-6" /></>}
            </Button>
          </form>

          <p className="mt-12 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
            Secured via <span className="text-primary italic">Prescop Protocol</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

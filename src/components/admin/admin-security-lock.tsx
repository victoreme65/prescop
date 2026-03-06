'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityLockProps {
  onUnlock: () => void;
}

export function AdminSecurityLock({ onUnlock }: SecurityLockProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const { toast } = useToast();

  const SECRET_CODE = '08033243867';

  useEffect(() => {
    if (lockoutTime && Date.now() > lockoutTime) {
      setLockoutTime(null);
      setAttempts(0);
    }
  }, [lockoutTime]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutTime) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
      toast({ 
        variant: "destructive", 
        title: "Panel Locked", 
        description: `Too many attempts. Wait ${remaining}s.` 
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      if (code === SECRET_CODE) {
        sessionStorage.setItem('prescop_admin_unlocked', 'true');
        onUnlock();
        toast({ title: "Access Granted", description: "Dashboard decrypted successfully." });
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          setLockoutTime(Date.now() + 120000); // 2 minutes
          toast({ variant: "destructive", title: "System Lockdown", description: "Maximum attempts reached. Locking for 2 minutes." });
        } else {
          toast({ variant: "destructive", title: "Invalid Code", description: `Incorrect secret key. ${5 - newAttempts} attempts remaining.` });
        }
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-10 animate-in fade-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="h-24 w-24 rounded-[2rem] bg-primary/10 flex items-center justify-center mx-auto ring-8 ring-primary/5">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white border-4 border-background animate-pulse">
            <ShieldAlert className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Security <span className="text-primary italic">Lock</span></h1>
          <p className="text-muted-foreground italic text-lg">Page refresh detected. Enter the secret unlock code to restore your session.</p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-6">
          <Input 
            type="password"
            placeholder="••••••••••••"
            className="h-16 rounded-2xl text-center text-2xl tracking-[0.5em] font-bold border-2 focus-visible:ring-primary shadow-inner"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading || !!lockoutTime}
            autoFocus
          />
          <Button 
            type="submit" 
            disabled={isLoading || !!lockoutTime || !code}
            className="w-full h-16 rounded-full bg-primary text-white font-bold text-xl shadow-2xl shadow-primary/20 gap-3"
          >
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <><ShieldAlert className="h-6 w-6" /> Decrypt Dashboard</>}
          </Button>
        </form>

        {lockoutTime && (
          <p className="text-destructive font-bold text-sm uppercase tracking-widest animate-pulse">
            Security Lockdown Active
          </p>
        )}
      </div>
    </div>
  );
}

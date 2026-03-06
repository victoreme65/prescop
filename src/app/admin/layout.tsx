'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSecurityLock } from '@/components/admin/admin-security-lock';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isVerifyingRole, setIsVerifyingRole] = useState(true);

  // 1. Initial Auth & Role Check
  const adminRoleRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'roles_admin', user.uid);
  }, [db, user?.uid]);

  const { data: adminRole, isLoading: isAdminRoleLoading } = useDoc(adminRoleRef);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsVerifyingRole(false);
      return;
    }

    if (!isUserLoading && !isAdminRoleLoading) {
      if (!user) {
        router.push('/admin/login');
      } else if (!adminRole && user.email !== 'admin@prescop.com') {
        // Fallback for primary admin or explicit role check
        router.push('/');
      } else {
        setIsVerifyingRole(false);
      }
    }
  }, [user, isUserLoading, adminRole, isAdminRoleLoading, router, pathname]);

  // 2. Security Lock Check (on refresh)
  useEffect(() => {
    const unlocked = sessionStorage.getItem('prescop_admin_unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isUserLoading || isVerifyingRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
        <p className="font-headline text-3xl italic animate-pulse">Verifying Admin Credentials...</p>
      </div>
    );
  }

  if (!isUnlocked) {
    return <AdminSecurityLock onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-4 md:p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

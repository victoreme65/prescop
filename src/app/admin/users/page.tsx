'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Ban, Trash2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const usersQuery = useMemoFirebase(() => query(collection(db, 'users'), orderBy('createdAt', 'desc')), [db]);
  const { data: users, isLoading } = useCollection(usersQuery);

  const handleBanUser = async (userId: string, currentStatus: string) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { status: currentStatus === 'banned' ? 'active' : 'banned' });
    toast({ title: "User Status Updated", description: "Moderation action applied successfully." });
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Permanently delete this user?')) {
      await deleteDoc(doc(db, 'users', userId));
      toast({ title: "User Deleted", description: "Record removed from database." });
    }
  };

  const filteredUsers = users?.filter(u => 
    u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">User <span className="text-primary italic">Moderation</span></h1>
          <p className="text-muted-foreground text-lg italic">Control marketplace accounts and permissions.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-12 h-12 rounded-full border-none bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="rounded-[3rem] border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/20 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="px-8 py-6 text-left">Identity</th>
                  <th className="px-8 py-6 text-left">Role</th>
                  <th className="px-8 py-6 text-left">Status</th>
                  <th className="px-8 py-6 text-left">Joined</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {user.firstName?.charAt(0) || <UserIcon className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className={cn(
                        "rounded-full px-3 py-0.5 text-[8px] font-bold uppercase",
                        user.role === 'admin' ? "bg-purple-100 text-purple-700" : 
                        user.role === 'seller' ? "bg-blue-100 text-blue-700" : "bg-secondary text-muted-foreground"
                      )}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className={cn(
                        "rounded-full px-3 py-0.5 text-[8px] font-bold uppercase",
                        user.status === 'banned' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      )}>
                        {user.status || 'active'}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-muted-foreground">
                      {user.createdAt?.toDate ? format(user.createdAt.toDate(), 'MMM dd, yyyy') : 'Recent'}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleBanUser(user.id, user.status)}
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-full text-orange-600 hover:bg-orange-50"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteUser(user.id)}
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

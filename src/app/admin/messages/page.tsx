'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Trash2, Calendar, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function AdminMessagesPage() {
  const db = useFirestore();
  const { toast } = useToast();

  const messagesQuery = useMemoFirebase(() => query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc')), [db]);
  const { data: messages, isLoading } = useCollection(messagesQuery);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this message?')) {
      await deleteDoc(doc(db, 'contactMessages', id));
      toast({ title: "Message Deleted", description: "Support ticket closed." });
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Support <span className="text-primary italic">Inbox</span></h1>
        <p className="text-muted-foreground text-lg italic">Customer queries and partnership requests.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {messages?.map((msg) => (
          <Card key={msg.id} className="rounded-[3rem] border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden">
            <CardContent className="p-0 flex flex-col md:flex-row">
              <div className="p-8 md:w-80 bg-secondary/10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm truncate">{msg.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground truncate">{msg.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    {msg.createdAt?.toDate ? format(msg.createdAt.toDate(), 'MMM dd, HH:mm') : 'Recent'}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div className="relative">
                  <MessageSquare className="absolute -left-1 -top-1 h-8 w-8 text-primary opacity-5" />
                  <h4 className="font-bold text-lg mb-4 text-primary italic">{msg.subject || 'New Inquiry'}</h4>
                  <p className="text-muted-foreground leading-relaxed italic">{msg.message}</p>
                </div>
                <div className="flex justify-end pt-8">
                  <Button 
                    onClick={() => handleDelete(msg.id)}
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive font-bold text-[10px] uppercase gap-2 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" /> Resolve Ticket
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!isLoading && (!messages || messages.length === 0) && (
          <div className="py-32 text-center opacity-20">
            <Mail className="h-16 w-16 mx-auto mb-4" />
            <p className="font-headline text-3xl italic">Inbox is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}

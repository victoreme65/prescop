'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Trash2, MessageCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function AdminReviewsPage() {
  const db = useFirestore();
  const { toast } = useToast();

  const reviewsQuery = useMemoFirebase(() => query(collectionGroup(db, 'reviews'), orderBy('createdAt', 'desc')), [db]);
  const { data: reviews, isLoading } = useCollection(reviewsQuery);

  const handleDeleteReview = async (review: any) => {
    if (confirm('Delete this review permanently?')) {
      try {
        const reviewRef = doc(db, 'products', review.productId, 'reviews', review.id);
        await deleteDoc(reviewRef);
        toast({ title: "Review Deleted", description: "Content removed from marketplace." });
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete review." });
      }
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Review <span className="text-primary italic">Moderation</span></h1>
        <p className="text-muted-foreground text-lg italic">Control marketplace sentiment and feedback.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews?.map((review) => (
          <Card key={review.id} className="rounded-[2.5rem] border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <Button 
                  onClick={() => handleDeleteReview(review)}
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mb-6 space-y-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Verified Customer</p>
                <p className="font-bold text-sm truncate">{review.userName || 'Anonymous'}</p>
              </div>

              <div className="relative">
                <MessageCircle className="absolute -left-1 -top-1 h-6 w-6 text-primary opacity-5" />
                <p className="text-sm italic text-muted-foreground leading-relaxed pl-2 border-l-2 border-primary/10">
                  "{review.comment}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-dashed flex items-center justify-between">
                <p className="text-[10px] font-bold text-muted-foreground">
                  {review.createdAt?.toDate ? format(review.createdAt.toDate(), 'MMM dd, yyyy') : 'Recent'}
                </p>
                <Badge variant="outline" className="text-[8px] font-bold rounded-full uppercase tracking-widest border-primary/20">
                  ID: {review.id.slice(0, 6)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {!isLoading && (!reviews || reviews.length === 0) && (
          <div className="col-span-full py-32 text-center opacity-20">
            <AlertCircle className="h-16 w-16 mx-auto mb-4" />
            <p className="font-headline text-3xl italic">No reviews found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

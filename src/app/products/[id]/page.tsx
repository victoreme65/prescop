'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, Sparkles, Share2, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { summarizeProductReviews } from '@/ai/flows/summarize-product-reviews-flow';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/cart-context';
import { useFirestore, useUser, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, serverTimestamp, query, orderBy, limit, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function ProductDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { user } = useUser();
  const db = useFirestore();
  
  // 1. Fetch Live Product Data
  const productRef = useMemoFirebase(() => {
    if (!db || !params.id) return null;
    return doc(db, 'products', params.id as string);
  }, [db, params.id]);

  const { data: product, isLoading: isProductLoading } = useDoc(productRef);
  
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [reviewSummary, setReviewSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Update active image when product loads
  useEffect(() => {
    if (product) {
      setActiveImage(product.images?.[0] || product.imageUrls?.[0] || null);
    }
  }, [product]);

  // 2. Fetch Live Reviews
  const reviewsQuery = useMemoFirebase(() => {
    if (!db || !params.id) return null;
    return query(
      collection(db, 'products', params.id as string, 'reviews'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
  }, [db, params.id]);

  const { data: dbReviews, isLoading: isLoadingReviews } = useCollection(reviewsQuery);

  const handleSummarizeReviews = async () => {
    if (!product || !dbReviews?.length) {
      toast({ title: "No Reviews", description: "This product doesn't have any reviews to summarize yet." });
      return;
    }

    setSummarizing(true);
    try {
      const result = await summarizeProductReviews({
        productTitle: product.title,
        reviews: dbReviews.map(r => ({ rating: r.rating, comment: r.comment }))
      });
      setReviewSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to summarize reviews." });
    } finally {
      setSummarizing(false);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to leave a review." });
      return;
    }
    if (!newComment.trim() || !product) return;

    setIsSubmittingReview(true);
    const reviewData = {
      productId: product.id,
      userId: user.uid,
      userName: user.displayName || 'Anonymous User',
      rating: newRating,
      comment: newComment,
      createdAt: serverTimestamp(),
      isApproved: true,
    };

    const reviewsRef = collection(db, 'products', product.id, 'reviews');
    
    addDocumentNonBlocking(reviewsRef, reviewData)
      .then(() => {
        toast({ title: "Review Posted!", description: "Thank you for sharing your experience." });
        setNewComment('');
        setNewRating(5);
      })
      .catch(() => {
        toast({ variant: "destructive", title: "Error", description: "Could not post your review." });
      })
      .finally(() => setIsSubmittingReview(false));
  };

  const onAddToCart = () => {
    if (!product) return;
    addToCart(product);
    toast({
      title: "Added to Bag",
      description: `${product.title} has been added to your shopping bag.`,
    });
  };

  if (isProductLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="font-headline text-2xl italic animate-pulse">Loading beauty essentials...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="font-headline text-6xl font-bold mb-4">Product Not Found</h1>
          <p className="text-xl text-muted-foreground mb-10">This beauty essential may have vanished.</p>
          <Button asChild className="rounded-full h-14 px-10 bg-primary"><a href="/products">Back to Marketplace</a></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.images || product.imageUrls || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-secondary/30 border shadow-inner group">
              <Image 
                src={activeImage || 'https://picsum.photos/seed/placeholder/800/800'} 
                alt={product.title} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary ring-4 ring-primary/10' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`${product.title} ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary px-6 py-2 font-bold uppercase text-xs tracking-widest border-none rounded-full">
                {product.category || 'Beauty'}
              </Badge>
              <div className="flex items-center gap-2 text-base font-bold text-yellow-600 bg-yellow-50 px-4 py-1 rounded-full">
                <Star className="h-4 w-4 fill-current" />
                {product.rating || product.averageRating || 4.5} <span className="text-muted-foreground font-medium text-xs">({product.numReviews || product.reviewCount || 0} Reviews)</span>
              </div>
            </div>

            <h1 className="font-headline text-5xl md:text-8xl font-bold mb-6 tracking-tighter leading-[1.05]">{product.title}</h1>
            
            <div className="text-sm text-muted-foreground mb-10 flex items-center gap-3">
              <span>Sold by</span>
              <span className="font-bold text-foreground underline decoration-primary/30 cursor-pointer hover:text-primary transition-colors">{product.sellerName || 'Verified Seller'}</span>
              <Badge className="bg-green-100 text-green-700 border-none text-[10px] px-3 py-0.5 rounded-full font-bold">TOP VENDOR</Badge>
            </div>

            <div className="text-5xl md:text-7xl font-bold text-primary mb-12 tracking-tighter">
              ₦{(product.price || 0).toLocaleString()}
            </div>

            <p className="font-body text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 italic opacity-90">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button onClick={onAddToCart} size="lg" className="flex-1 rounded-full h-16 bg-primary text-white font-bold text-xl shadow-2xl shadow-primary/20 gap-3 hover:scale-[1.02] transition-transform">
                <ShoppingCart className="h-6 w-6" /> Add to Shopping Bag
              </Button>
              <div className="flex gap-4">
                <Button size="icon" variant="outline" className="h-16 w-16 rounded-full border-primary/20 hover:bg-primary/5 transition-colors">
                  <Heart className="h-6 w-6 text-primary" />
                </Button>
                <Button size="icon" variant="outline" className="h-16 w-16 rounded-full border-primary/20 hover:bg-primary/5 transition-colors">
                  <Share2 className="h-6 w-6 text-primary" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-12 border-t border-dashed border-primary/20">
              <div className="flex flex-col items-center sm:items-start gap-3">
                <ShieldCheck className="h-12 w-12 text-primary opacity-60" />
                <span className="text-xs font-bold uppercase tracking-widest text-center sm:text-left leading-tight">100% Authentic<br/>Quality Guaranteed</span>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-3">
                <Truck className="h-12 w-12 text-primary opacity-60" />
                <span className="text-xs font-bold uppercase tracking-widest text-center sm:text-left leading-tight">Secure Nationwide<br/>Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-3">
                <RefreshCw className="h-12 w-12 text-primary opacity-60" />
                <span className="text-xs font-bold uppercase tracking-widest text-center sm:text-left leading-tight">Hassle-Free<br/>7-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[4rem] p-8 md:p-20 border shadow-sm">
          <Tabs defaultValue="details">
            <TabsList className="bg-transparent border-b rounded-none w-full justify-start gap-12 h-auto p-0 mb-12 overflow-x-auto scrollbar-hide">
              <TabsTrigger value="details" className="data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-0 py-6 text-2xl font-headline font-bold transition-all opacity-60 data-[state=active]:opacity-100">Product Details</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-0 py-6 text-2xl font-headline font-bold transition-all opacity-60 data-[state=active]:opacity-100">Verified Reviews ({dbReviews?.length || 0})</TabsTrigger>
              <TabsTrigger value="usage" className="data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-0 py-6 text-2xl font-headline font-bold transition-all opacity-60 data-[state=active]:opacity-100">How to Use</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="font-body text-2xl text-muted-foreground leading-relaxed space-y-8">
              <p>Expertly formulated for modern African skin, this premium essential combines botanical luxury with advanced clinical science. Dermatologist tested and verified for the highest quality standards in the Nigerian market.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                {[
                  "Paraben-free & Organic",
                  "Cruelty-free & Vegan",
                  "Safe for Sensitive Skin",
                  "Rich in Antioxidants",
                  "Clinically Tested",
                  "Non-Comedogenic"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="h-3 w-3 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                    <span className="text-lg font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-16">
                {/* AI Summary Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 p-12 bg-primary/5 rounded-[3rem] border border-primary/10 shadow-inner">
                  <div className="max-w-md">
                    <h4 className="font-headline font-bold text-4xl mb-3">Beauty Insights</h4>
                    <p className="text-base text-muted-foreground italic">AI-powered summarization of verified Prescop customer experiences.</p>
                  </div>
                  {!reviewSummary ? (
                    <Button onClick={handleSummarizeReviews} disabled={summarizing} className="bg-accent text-white rounded-full gap-3 px-12 h-16 font-bold shadow-xl shadow-accent/20 text-lg hover:scale-105 transition-transform">
                      <Sparkles className="h-5 w-5" /> {summarizing ? 'Analyzing Sentiment...' : 'Summarize Reviews'}
                    </Button>
                  ) : (
                    <div className="flex-1 max-w-2xl bg-white p-10 rounded-[2.5rem] shadow-sm border border-accent/20 italic text-xl leading-relaxed animate-in fade-in slide-in-from-right duration-700">
                      "{reviewSummary}"
                    </div>
                  )}
                </div>

                {/* Submit Review Section */}
                {user ? (
                   <div className="p-12 bg-white rounded-[3rem] border shadow-sm space-y-8">
                      <div className="flex items-center gap-4">
                        <MessageSquare className="h-8 w-8 text-primary" />
                        <h4 className="font-headline font-bold text-3xl">Leave a Review</h4>
                      </div>
                      <form onSubmit={handlePostReview} className="space-y-6">
                         <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-muted-foreground mr-4">Your Rating:</span>
                           {[1, 2, 3, 4, 5].map((star) => (
                             <button
                               key={star}
                               type="button"
                               onClick={() => setNewRating(star)}
                               className="p-1"
                             >
                               <Star className={`h-8 w-8 ${star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                             </button>
                           ))}
                         </div>
                         <Textarea 
                            placeholder="Share your experience with this beauty essential..." 
                            className="min-h-[120px] rounded-2xl border-secondary text-lg"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                         />
                         <Button type="submit" disabled={isSubmittingReview} className="rounded-full bg-primary h-14 px-10 font-bold gap-3 shadow-lg shadow-primary/10">
                            {isSubmittingReview ? 'Posting...' : 'Post Verified Review'} <Send className="h-5 w-5" />
                         </Button>
                      </form>
                   </div>
                ) : (
                   <div className="p-10 text-center bg-secondary/10 rounded-[3rem] border-2 border-dashed border-primary/10">
                      <p className="font-bold text-xl italic mb-4">Want to share your thoughts?</p>
                      <Button asChild variant="outline" className="rounded-full px-8 h-12 border-primary/20"><a href="/login">Sign in to leave a review</a></Button>
                   </div>
                )}

                {/* Reviews List */}
                <div className="grid gap-12">
                  {isLoadingReviews ? (
                     [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl w-full" />)
                  ) : dbReviews && dbReviews.length > 0 ? (
                    dbReviews.map((review) => (
                      <div key={review.id} className="border-b border-secondary/50 pb-12 last:border-0">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-5">
                            <div className="h-16 w-16 rounded-[1.25rem] bg-secondary/50 flex items-center justify-center font-bold text-primary text-2xl shadow-inner">
                              {review.userName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <p className="font-bold text-xl">{review.userName}</p>
                                <Badge className="text-[10px] bg-green-100 text-green-700 border-none px-3 py-0.5 rounded-full font-bold">VERIFIED PURCHASE</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">
                                {review.createdAt?.toDate ? format(review.createdAt.toDate(), 'MMM dd, yyyy') : 'Recent'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="font-body text-2xl text-muted-foreground italic leading-relaxed pl-2 border-l-4 border-primary/10">"{review.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center text-muted-foreground bg-secondary/5 rounded-[3rem]">
                       <p className="text-xl italic">No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="font-body text-2xl text-muted-foreground leading-relaxed">
              <div className="space-y-8">
                 <p>For optimal results, incorporate this into your daily beauty ritual. Apply a small amount to clean, damp skin using gentle upward circular motions. Best used after cleansing and before moisturizing.</p>
                 <div className="p-10 bg-primary/5 rounded-[3rem] border-l-8 border-primary italic text-primary font-bold text-3xl tracking-tight leading-tight">
                    "Consistent use reveals the most significant transformation in skin radiance within 14 days of application."
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                    <div className="p-6 bg-white rounded-2xl border text-center space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">Step 01</p>
                      <p className="font-bold">Cleanse</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border text-center space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">Step 02</p>
                      <p className="font-bold">Apply Product</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border text-center space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">Step 03</p>
                      <p className="font-bold">Moisturize</p>
                    </div>
                 </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

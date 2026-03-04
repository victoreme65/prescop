
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, MessageSquare, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { summarizeProductReviews } from '@/ai/flows/summarize-product-reviews-flow';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === params.id) || MOCK_PRODUCTS[0];
  
  const [reviewSummary, setReviewSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  const handleSummarizeReviews = async () => {
    setSummarizing(true);
    try {
      const result = await summarizeProductReviews({
        productTitle: product.title,
        reviews: MOCK_REVIEWS.map(r => ({ rating: r.rating, comment: r.comment }))
      });
      setReviewSummary(result.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary/30 shadow-inner">
              <Image 
                src={product.images[0]} 
                alt={product.title} 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-secondary/30 cursor-pointer border-2 border-transparent hover:border-primary transition-all">
                  <Image src={img} alt={`${product.title} ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex items-center gap-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                {product.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm font-bold text-yellow-600">
                <Star className="h-4 w-4 fill-current" />
                {product.rating} ({product.numReviews} Reviews)
              </div>
            </div>

            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 leading-tight">{product.title}</h1>
            
            <p className="text-sm text-muted-foreground mb-6">
              Sold by <span className="font-bold text-foreground underline cursor-pointer">{product.sellerName}</span>
            </p>

            <div className="text-3xl font-bold text-primary mb-8">
              ₦{product.price.toLocaleString()}
            </div>

            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex flex-col gap-4 mb-10">
              <div className="flex gap-4">
                <Button size="lg" className="flex-1 rounded-full h-14 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 gap-2">
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="h-14 w-14 rounded-full border-secondary p-0">
                  <Heart className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-secondary">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-primary/60" />
                <span className="text-xs font-bold uppercase tracking-widest leading-tight">Authenticity Guaranteed</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-8 w-8 text-primary/60" />
                <span className="text-xs font-bold uppercase tracking-widest leading-tight">Express Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-8 w-8 text-primary/60" />
                <span className="text-xs font-bold uppercase tracking-widest leading-tight">7 Days Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Details & Reviews */}
        <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-secondary/50">
          <Tabs defaultValue="details">
            <TabsList className="bg-transparent border-b rounded-none w-full justify-start gap-8 h-auto p-0 mb-8">
              <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-lg">Product Details</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-lg">Reviews ({product.numReviews})</TabsTrigger>
              <TabsTrigger value="usage" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-lg">How to Use</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="font-body text-lg text-muted-foreground leading-relaxed">
              <p className="mb-4">This dermatologist-tested formula is designed specifically for sensitive skin, providing deep hydration without irritation. Key ingredients include local Nigerian botanicals known for their healing properties.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Paraben-free and Cruelty-free</li>
                <li>Made with organic rose extracts</li>
                <li>Lightweight and non-greasy</li>
                <li>Suitable for all skin types</li>
              </ul>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-secondary/10 rounded-2xl">
                  <div>
                    <h4 className="font-headline font-bold text-xl mb-1">Customer Sentiment</h4>
                    <p className="text-sm text-muted-foreground">AI is ready to analyze {MOCK_REVIEWS.length} reviews for you.</p>
                  </div>
                  {!reviewSummary ? (
                    <Button 
                      onClick={handleSummarizeReviews} 
                      disabled={summarizing}
                      className="bg-accent hover:bg-accent/90 text-white rounded-full gap-2 px-8"
                    >
                      <Sparkles className="h-4 w-4" /> {summarizing ? 'Analyzing...' : 'Summarize with AI'}
                    </Button>
                  ) : (
                    <div className="flex-1 max-w-2xl bg-white p-6 rounded-xl shadow-sm border border-accent/20">
                      <div className="flex items-center gap-2 mb-2 text-accent">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase">AI Insight</span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{reviewSummary}</p>
                    </div>
                  )}
                </div>

                <div className="grid gap-6">
                  {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{review.userName}</p>
                            <p className="text-xs text-muted-foreground">{review.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="font-body text-muted-foreground italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="font-body text-lg text-muted-foreground leading-relaxed">
              <p>Apply 2-3 drops onto clean, damp skin. Gently massage in upward circular motions until fully absorbed. For best results, use morning and night before your favorite moisturizer.</p>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
}

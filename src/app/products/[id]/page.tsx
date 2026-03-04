'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, Sparkles, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { summarizeProductReviews } from '@/ai/flows/summarize-product-reviews-flow';
import { Badge } from '@/components/ui/badge';

export default function ProductDetailPage() {
  const params = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === params.id) || MOCK_PRODUCTS[0];
  
  const [activeImage, setActiveImage] = useState(product.images?.[0] || product.imageUrls?.[0]);
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

  const images = product.images || product.imageUrls || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-20">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-secondary/30 border border-secondary/50">
              <Image 
                src={activeImage || 'https://picsum.photos/seed/placeholder/800/800'} 
                alt={product.title} 
                fill 
                className="object-cover" 
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-transparent opacity-60'}`}
                >
                  <Image src={img} alt={`${product.title} ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[9px]">
                {product.category || 'Beauty'}
              </Badge>
              <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-600">
                <Star className="h-4 w-4 fill-current" />
                {product.rating || 4.5} <span className="text-muted-foreground">({product.numReviews || 0} Reviews)</span>
              </div>
            </div>

            <h1 className="font-headline text-3xl sm:text-5xl font-bold mb-4 tracking-tight leading-tight">{product.title}</h1>
            
            <div className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
              <span>Sold by</span>
              <span className="font-bold text-foreground underline decoration-primary/30 cursor-pointer">{product.sellerName || 'Verified Seller'}</span>
              <Badge className="bg-green-100 text-green-700 border-none text-[8px] px-2 py-0">Top Seller</Badge>
            </div>

            <div className="text-3xl font-bold text-primary mb-8 tracking-tight">
              ₦{product.price.toLocaleString()}
            </div>

            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-10 italic">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="flex-1 rounded-full h-14 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-3 font-bold">
                <ShoppingCart className="h-5 w-5" /> Add to Shopping Bag
              </Button>
              <div className="flex gap-4">
                <Button size="icon" variant="outline" className="h-14 w-14 rounded-full border-secondary/50">
                  <Heart className="h-5 w-5 text-primary" />
                </Button>
                <Button size="icon" variant="outline" className="h-14 w-14 rounded-full border-secondary/50">
                  <Share2 className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-secondary/50">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <ShieldCheck className="h-8 w-8 text-primary opacity-50" />
                <span className="text-[9px] font-bold uppercase tracking-widest">100% Authentic Quality</span>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <Truck className="h-8 w-8 text-primary opacity-50" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Express Nationwide Delivery</span>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <RefreshCw className="h-8 w-8 text-primary opacity-50" />
                <span className="text-[9px] font-bold uppercase tracking-widest">7-Day Free Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-card rounded-[2.5rem] p-6 md:p-12 shadow-xl border border-secondary/50">
          <Tabs defaultValue="details">
            <TabsList className="bg-transparent border-b rounded-none w-full justify-start gap-8 h-auto p-0 mb-10 overflow-x-auto scrollbar-hide">
              <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-lg font-headline font-bold">Details</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-lg font-headline font-bold">Reviews ({product.numReviews || 0})</TabsTrigger>
              <TabsTrigger value="usage" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-lg font-headline font-bold">How to Use</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="font-body text-lg text-muted-foreground leading-relaxed space-y-4">
              <p>Expertly formulated for modern African skin, this premium beauty essential combines natural botanicals with advanced clinical science. Dermatologist tested and verified for the highest quality standards.</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none pl-0">
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Paraben-free & Organic</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Cruelty-free Verification</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Safe for Sensitive Skin</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Rich in Vitamin E & Antioxidants</li>
              </ul>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-secondary/5 rounded-[2rem] border border-secondary/20">
                  <div className="text-center md:text-left">
                    <h4 className="font-headline font-bold text-xl mb-1">Customer Sentiment</h4>
                    <p className="text-xs text-muted-foreground">AI-powered summary of our latest verified reviews.</p>
                  </div>
                  {!reviewSummary ? (
                    <Button 
                      onClick={handleSummarizeReviews} 
                      disabled={summarizing}
                      className="bg-accent hover:bg-accent/90 text-white rounded-full gap-2 px-8 h-12 font-bold"
                    >
                      <Sparkles className="h-4 w-4" /> {summarizing ? 'Analyzing...' : 'Summarize with AI'}
                    </Button>
                  ) : (
                    <div className="flex-1 max-w-2xl bg-white p-6 rounded-[1.5rem] shadow-sm border border-accent/20">
                      <div className="flex items-center gap-2 mb-2 text-accent">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">AI Intelligence</span>
                      </div>
                      <p className="text-sm leading-relaxed italic font-medium">"{reviewSummary}"</p>
                    </div>
                  )}
                </div>

                <div className="grid gap-8">
                  {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="border-b border-secondary/50 pb-8 last:border-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center font-bold text-primary">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm flex items-center gap-2">
                              {review.userName} <Badge className="text-[7px] bg-green-100 text-green-700 border-none font-bold uppercase">Verified</Badge>
                            </p>
                            <p className="text-[10px] text-muted-foreground">{review.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="font-body text-lg text-muted-foreground italic leading-relaxed">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="font-body text-lg text-muted-foreground leading-relaxed">
              <div className="space-y-4">
                 <p>For optimal results, incorporate this into your daily beauty ritual. Apply a small amount to clean, damp skin using gentle upward circular motions. Follow with SPF during the day.</p>
                 <div className="p-6 bg-primary/5 rounded-2xl border-l-4 border-primary italic">
                    "Consistent use over 21 days reveals the most significant transformation in skin radiance and texture."
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

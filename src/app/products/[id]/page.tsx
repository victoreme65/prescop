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
  
  const [activeImage, setActiveImage] = useState(product.images[0] || product.imageUrls[0]);
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
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-secondary/30 shadow-inner border border-secondary/50">
              <Image 
                src={activeImage} 
                alt={product.title} 
                fill 
                className="object-cover transition-all duration-500" 
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${activeImage === img ? 'border-primary shadow-lg scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`${product.title} ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-8 flex flex-wrap items-center gap-6">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                {product.category || 'Beauty'}
              </Badge>
              <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-600">
                <Star className="h-5 w-5 fill-current" />
                {product.rating || 4.5} <span className="text-muted-foreground font-medium">({product.numReviews || 0} Reviews)</span>
              </div>
            </div>

            <h1 className="font-headline text-4xl sm:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">{product.title}</h1>
            
            <p className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
              Sold by <span className="font-bold text-foreground underline decoration-primary/30 cursor-pointer">{product.sellerName || 'Verified Seller'}</span>
              <Badge className="bg-green-100 text-green-700 border-none text-[8px] px-2 py-0">Top Seller</Badge>
            </p>

            <div className="text-4xl font-bold text-primary mb-10 tracking-tight">
              ₦{product.price.toLocaleString()}
            </div>

            <p className="font-body text-xl text-muted-foreground leading-relaxed mb-12 italic opacity-80">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <Button size="lg" className="flex-1 rounded-full h-16 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/25 gap-3 font-bold text-lg">
                <ShoppingCart className="h-6 w-6" /> Add to Shopping Bag
              </Button>
              <div className="flex gap-4 justify-center">
                <Button size="lg" variant="outline" className="h-16 w-16 rounded-full border-secondary/50 p-0 hover:bg-primary/5">
                  <Heart className="h-6 w-6 text-primary" />
                </Button>
                <Button size="lg" variant="outline" className="h-16 w-16 rounded-full border-secondary/50 p-0 hover:bg-primary/5">
                  <Share2 className="h-6 w-6 text-primary" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-secondary/50">
              <div className="flex flex-col items-center sm:items-start gap-3">
                <ShieldCheck className="h-10 w-10 text-primary opacity-40" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-tight text-center sm:text-left">100% Authentic Quality</span>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-3">
                <Truck className="h-10 w-10 text-primary opacity-40" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-tight text-center sm:text-left">Express Nationwide Delivery</span>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-3">
                <RefreshCw className="h-10 w-10 text-primary opacity-40" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-tight text-center sm:text-left">7-Day Free Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-card rounded-[4rem] p-10 md:p-16 shadow-xl border border-secondary/50 overflow-hidden">
          <Tabs defaultValue="details">
            <TabsList className="bg-transparent border-b rounded-none w-full justify-start gap-12 h-auto p-0 mb-12 flex-nowrap overflow-x-auto scrollbar-hide">
              <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-6 text-xl font-headline font-bold">Details</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-6 text-xl font-headline font-bold">Reviews ({product.numReviews || 0})</TabsTrigger>
              <TabsTrigger value="usage" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-6 text-xl font-headline font-bold">How to Use</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="font-body text-xl text-muted-foreground leading-relaxed space-y-6">
              <p>Expertly formulated for modern African skin, this premium beauty essential combines natural botanicals with advanced clinical science. Dermatologist tested and verified for the highest quality standards.</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none pl-0">
                <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-primary" /> Paraben-free & Organic</li>
                <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-primary" /> Cruelty-free Verification</li>
                <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-primary" /> Safe for Sensitive Skin</li>
                <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-primary" /> Rich in Vitamin E & Antioxidants</li>
              </ul>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-10 bg-secondary/5 rounded-[3rem] border border-secondary/20">
                  <div className="text-center md:text-left">
                    <h4 className="font-headline font-bold text-2xl mb-2">Customer Sentiment</h4>
                    <p className="text-sm text-muted-foreground">AI-powered summary of our latest verified reviews.</p>
                  </div>
                  {!reviewSummary ? (
                    <Button 
                      onClick={handleSummarizeReviews} 
                      disabled={summarizing}
                      className="bg-accent hover:bg-accent/90 text-white rounded-full gap-3 px-10 h-14 font-bold"
                    >
                      <Sparkles className="h-5 w-5" /> {summarizing ? 'Analyzing...' : 'Summarize with AI'}
                    </Button>
                  ) : (
                    <div className="flex-1 max-w-2xl bg-white p-8 rounded-[2.5rem] shadow-sm border border-accent/20">
                      <div className="flex items-center gap-3 mb-4 text-accent">
                        <Sparkles className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">AI Intelligence</span>
                      </div>
                      <p className="text-base leading-relaxed whitespace-pre-wrap italic font-medium">"{reviewSummary}"</p>
                    </div>
                  )}
                </div>

                <div className="grid gap-10">
                  {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="border-b border-secondary/50 pb-10 last:border-0">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-[1.25rem] bg-secondary flex items-center justify-center font-bold text-primary text-xl">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-lg flex items-center gap-2">
                              {review.userName} <Badge className="text-[8px] bg-green-100 text-green-700 border-none font-bold uppercase">Verified</Badge>
                            </p>
                            <p className="text-xs text-muted-foreground">{review.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="font-body text-xl text-muted-foreground italic leading-relaxed">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="font-body text-xl text-muted-foreground leading-relaxed">
              <div className="space-y-6">
                 <p>For optimal results, incorporate this into your daily beauty ritual. Apply a small amount to clean, damp skin using gentle upward circular motions. Follow with SPF during the day.</p>
                 <div className="p-8 bg-primary/5 rounded-[2rem] border-l-4 border-primary italic">
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

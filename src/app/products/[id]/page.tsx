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
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-20">
          {/* GALLERY */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-secondary/30 border shadow-inner">
              <Image 
                src={activeImage || 'https://picsum.photos/seed/placeholder/800/800'} 
                alt={product.title} 
                fill 
                className="object-cover" 
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`${product.title} ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary px-4 py-1.5 font-bold uppercase text-[10px] tracking-widest border-none">
                {product.category || 'Beauty'}
              </Badge>
              <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-600">
                <Star className="h-4 w-4 fill-current" />
                {product.rating || 4.5} <span className="text-muted-foreground font-medium">({product.numReviews || 0} Reviews)</span>
              </div>
            </div>

            <h1 className="font-headline text-4xl md:text-7xl font-bold mb-4 tracking-tighter leading-[1.1]">{product.title}</h1>
            
            <div className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
              <span>Sold by</span>
              <span className="font-bold text-foreground underline decoration-primary/30 cursor-pointer">{product.sellerName || 'Verified Seller'}</span>
              <Badge className="bg-green-100 text-green-700 border-none text-[8px] px-2 py-0">Top Seller</Badge>
            </div>

            <div className="text-4xl md:text-6xl font-bold text-primary mb-8 tracking-tighter">
              ₦{product.price.toLocaleString()}
            </div>

            <p className="font-body text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 italic">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="flex-1 rounded-full h-16 bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 gap-3">
                <ShoppingCart className="h-6 w-6" /> Add to Shopping Bag
              </Button>
              <div className="flex gap-4">
                <Button size="icon" variant="outline" className="h-16 w-16 rounded-full border-primary/20">
                  <Heart className="h-6 w-6 text-primary" />
                </Button>
                <Button size="icon" variant="outline" className="h-16 w-16 rounded-full border-primary/20">
                  <Share2 className="h-6 w-6 text-primary" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-dashed">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <ShieldCheck className="h-10 w-10 text-primary opacity-60" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-center sm:text-left">100% Authentic Quality</span>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <Truck className="h-10 w-10 text-primary opacity-60" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-center sm:text-left">Nationwide Delivery</span>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <RefreshCw className="h-10 w-10 text-primary opacity-60" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-center sm:text-left">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <div className="bg-white rounded-[3rem] p-8 md:p-14 border shadow-sm">
          <Tabs defaultValue="details">
            <TabsList className="bg-transparent border-b rounded-none w-full justify-start gap-10 h-auto p-0 mb-10 overflow-x-auto scrollbar-hide">
              <TabsTrigger value="details" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-xl font-headline font-bold transition-none">Product Details</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-xl font-headline font-bold transition-none">Verified Reviews ({product.numReviews || 0})</TabsTrigger>
              <TabsTrigger value="usage" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-xl font-headline font-bold transition-none">How to Use</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="font-body text-xl text-muted-foreground leading-relaxed space-y-6">
              <p>Expertly formulated for modern African skin, this premium essential combines botanical luxury with advanced clinical science. Dermatologist tested and verified for the highest quality standards in the Nigerian market.</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none pl-0">
                <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-primary" /> Paraben-free & Organic</li>
                <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-primary" /> Cruelty-free & Vegan</li>
                <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-primary" /> Safe for Sensitive Skin</li>
                <li className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-primary" /> Rich in Antioxidants</li>
              </ul>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-10 bg-primary/5 rounded-[2.5rem] border border-primary/10">
                  <div className="max-w-md">
                    <h4 className="font-headline font-bold text-3xl mb-2">Review Summary</h4>
                    <p className="text-sm text-muted-foreground">AI-powered insights from verified Prescop customers.</p>
                  </div>
                  {!reviewSummary ? (
                    <Button onClick={handleSummarizeReviews} disabled={summarizing} className="bg-accent text-white rounded-full gap-2 px-10 h-14 font-bold shadow-lg">
                      <Sparkles className="h-4 w-4" /> {summarizing ? 'Analyzing...' : 'Summarize Reviews'}
                    </Button>
                  ) : (
                    <div className="flex-1 max-w-2xl bg-white p-8 rounded-[2rem] shadow-sm border border-accent/20 italic text-lg leading-relaxed">
                      "{reviewSummary}"
                    </div>
                  )}
                </div>

                <div className="grid gap-10">
                  {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="border-b border-secondary/50 pb-10 last:border-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center font-bold text-primary text-xl">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-lg flex items-center gap-2">
                              {review.userName} <Badge className="text-[8px] bg-green-100 text-green-700 border-none px-2 py-0">Verified Purchase</Badge>
                            </p>
                            <p className="text-xs text-muted-foreground">{review.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
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
                 <p>For optimal results, incorporate this into your daily beauty ritual. Apply a small amount to clean, damp skin using gentle upward circular motions. Best used after cleansing and before moisturizing.</p>
                 <div className="p-8 bg-primary/5 rounded-[2rem] border-l-8 border-primary italic text-primary font-bold text-2xl tracking-tight">
                    "Consistent use reveals the most significant transformation in skin radiance within 14 days."
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


import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/marketplace/product-card';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://picsum.photos/seed/prescop-hero/1200/600"
              alt="Beauty Hero"
              fill
              className="object-cover"
              priority
              data-ai-hint="skincare beauty"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl animate-in fade-in slide-in-from-left-4 duration-1000">
              <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1 rounded-full text-sm font-medium">
                New Collection 2024
              </Badge>
              <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight mb-6">
                Redefine Your <br />
                <span className="text-primary italic">Natural Glow</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 font-body leading-relaxed max-w-lg">
                Discover Nigeria's most curated collection of premium beauty products. From local artisan skincare to global makeup icons.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white shadow-lg">
                  <Link href="/products">Shop Collection</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full px-8 border-primary/20">
                  <Link href="/seller/apply">Become a Seller</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-secondary/20">
                <ShieldCheck className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-headline font-bold text-lg">Guaranteed Quality</h3>
                  <p className="text-sm text-muted-foreground">Only authentic products from verified sellers.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-secondary/20">
                <Truck className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-headline font-bold text-lg">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">Reliable nationwide shipping across Nigeria.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-secondary/20">
                <Sparkles className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-headline font-bold text-lg">Curated Selection</h3>
                  <p className="text-sm text-muted-foreground">Handpicked beauty essentials just for you.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-headline text-4xl font-bold mb-4">Trending Now</h2>
                <p className="text-muted-foreground">The most loved beauty picks this week.</p>
              </div>
              <Button variant="link" asChild className="text-primary font-bold">
                <Link href="/products" className="flex items-center gap-2">
                  View All Products <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {MOCK_PRODUCTS.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Preview */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-4xl font-bold mb-12 text-center">Shop By Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
              <Link href="/products?category=Skincare" className="relative group overflow-hidden rounded-3xl md:row-span-2">
                <Image 
                  src="https://picsum.photos/seed/skincare-cat/800/1200" 
                  alt="Skincare" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  data-ai-hint="woman skincare"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-8">
                  <div className="text-white">
                    <h3 className="font-headline text-3xl font-bold mb-2">Skincare</h3>
                    <p className="text-white/80">Nourish and protect your radiance</p>
                  </div>
                </div>
              </Link>
              <Link href="/products?category=Makeup" className="relative group overflow-hidden rounded-3xl">
                <Image 
                  src="https://picsum.photos/seed/makeup-cat/800/600" 
                  alt="Makeup" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  data-ai-hint="luxury makeup"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-8">
                  <div className="text-white">
                    <h3 className="font-headline text-3xl font-bold mb-2">Makeup</h3>
                    <p className="text-white/80">Unleash your creativity</p>
                  </div>
                </div>
              </Link>
              <Link href="/products?category=Fragrance" className="relative group overflow-hidden rounded-3xl">
                <Image 
                  src="https://picsum.photos/seed/perfume-cat/800/600" 
                  alt="Fragrance" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  data-ai-hint="perfume bottle"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-8">
                  <div className="text-white">
                    <h3 className="font-headline text-3xl font-bold mb-2">Fragrance</h3>
                    <p className="text-white/80">Scents that define you</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: "default" | "outline", className?: string }) {
  const variants = {
    default: "bg-primary text-white",
    outline: "border border-input bg-transparent"
  };
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}

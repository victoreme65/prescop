'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const rating = product.rating || product.averageRating || 4.5;
  const numReviews = product.numReviews || product.reviewCount || 0;
  const price = product.price || 0;
  const displayImage = product.images?.[0] || product.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/600/600';

  return (
    <Card className="group overflow-hidden rounded-[2.5rem] border-none shadow-sm transition-all hover:shadow-2xl bg-card flex flex-col h-full relative">
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-secondary/30 shrink-0">
        <Image
          src={displayImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 z-10">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white border-none shadow-md"
            onClick={(e) => {
              e.preventDefault();
              // Wishlist logic
            }}
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <Badge className="absolute bottom-5 left-5 bg-accent text-white border-none text-[10px] px-3 py-1 font-bold shadow-lg">
            Only {product.stock} Left
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge className="absolute bottom-5 left-5 bg-muted text-muted-foreground border-none text-[10px] px-3 py-1 font-bold">
            Out of Stock
          </Badge>
        )}
      </Link>
      
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.category || 'Beauty'}</span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-yellow-600">
            <Star className="h-3 w-3 fill-current" />
            {rating}
          </div>
        </div>
        
        <Link href={`/products/${product.id}`} className="block mb-3">
          <h3 className="font-headline font-bold text-lg md:text-xl line-clamp-1 hover:text-primary transition-colors leading-tight">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 min-h-[2.5rem] leading-relaxed italic opacity-80">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-bold opacity-60">Price</span>
            <span className="text-xl font-bold text-primary">
              ₦{price.toLocaleString()}
            </span>
          </div>
          <Button size="icon" className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
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
    <Card className="group overflow-hidden rounded-[2.5rem] border-none shadow-sm transition-all hover:shadow-xl bg-card flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-secondary/30">
        <Image
          src={displayImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 z-10">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{product.category || 'Beauty'}</span>
          <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600">
            <Star className="h-3 w-3 fill-current" />
            {rating}
          </div>
        </div>
        
        <Link href={`/products/${product.id}`} className="block mb-2">
          <h3 className="font-headline font-bold text-base md:text-lg line-clamp-1 hover:text-primary transition-colors leading-tight">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-[11px] text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem] italic leading-relaxed opacity-80">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
          <span className="text-lg font-bold text-primary">
            ₦{price.toLocaleString()}
          </span>
          <Button size="icon" className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

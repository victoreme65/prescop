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
  return (
    <Card className="group overflow-hidden rounded-[2rem] border-none shadow-sm transition-all hover:shadow-xl bg-card flex flex-col h-full relative">
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-secondary/30 shrink-0">
        <Image
          src={product.images?.[0] || product.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/600/600'}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 z-10">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              // Wishlist logic
            }}
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        {product.stock < 10 && (
          <Badge className="absolute bottom-4 left-4 bg-accent text-white border-none text-[10px] px-3 py-1 font-bold">
            Only {product.stock} left
          </Badge>
        )}
      </Link>
      
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.category || 'Beauty'}</span>
          <div className="flex items-center gap-1 text-xs font-bold">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {product.rating || product.averageRating || '4.5'}
          </div>
        </div>
        
        <Link href={`/products/${product.id}`} className="block mb-2">
          <h3 className="font-headline font-bold text-lg md:text-xl line-clamp-1 hover:text-primary transition-colors leading-tight">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Price</span>
            <span className="text-xl font-bold text-primary">
              ₦{product.price.toLocaleString()}
            </span>
          </div>
          <Button size="icon" className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
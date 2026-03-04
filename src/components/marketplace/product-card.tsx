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
    <Card className="group overflow-hidden rounded-2xl border-none shadow-sm transition-all hover:shadow-md bg-card flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-secondary/30 shrink-0">
        <Image
          src={product.images?.[0] || product.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/600/600'}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => {
            e.preventDefault();
            // Handle wishlist
          }}
        >
          <Heart className="h-4 w-4 text-primary" />
        </Button>
        {product.stock < 10 && (
          <Badge className="absolute bottom-3 left-3 bg-accent text-white border-none text-[10px] px-2 py-0.5">
            Only {product.stock} left
          </Badge>
        )}
      </Link>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
          <span className="truncate mr-2">{product.category}</span>
          <div className="flex items-center gap-1 text-foreground shrink-0">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {product.rating || product.averageRating || '0.0'}
          </div>
        </div>
        
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-headline font-bold text-base sm:text-lg line-clamp-1 mb-1 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-primary">
            ₦{product.price.toLocaleString()}
          </span>
          <Button size="sm" variant="outline" className="rounded-full h-9 gap-2 hover:bg-primary hover:text-white border-primary/20 text-xs font-bold">
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


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
    <Card className="group overflow-hidden rounded-2xl border-none shadow-sm transition-all hover:shadow-md bg-card">
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-secondary/30">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4 text-primary" />
        </Button>
        {product.stock < 10 && (
          <Badge className="absolute bottom-3 left-3 bg-accent text-white border-none">
            Only {product.stock} left
          </Badge>
        )}
      </Link>
      
      <CardContent className="p-4">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider">
          <span>{product.category}</span>
          <div className="flex items-center gap-1 font-medium text-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {product.rating}
          </div>
        </div>
        
        <Link href={`/products/${product.id}`}>
          <h3 className="font-headline font-semibold text-lg line-clamp-1 mb-1 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ₦{product.price.toLocaleString()}
          </span>
          <Button size="sm" variant="outline" className="rounded-full h-9 gap-2 hover:bg-primary hover:text-white border-primary/20">
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

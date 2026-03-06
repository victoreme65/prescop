'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2, Package, Eye, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function AdminProductsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const productsQuery = useMemoFirebase(() => query(collection(db, 'products'), orderBy('createdAt', 'desc')), [db]);
  const { data: products, isLoading } = useCollection(productsQuery);

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Permanently remove this product from the marketplace?')) {
      await deleteDoc(doc(db, 'products', productId));
      toast({ title: "Product Removed", description: "Item successfully deleted." });
    }
  };

  const filteredProducts = products?.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Marketplace <span className="text-primary italic">Catalog</span></h1>
          <p className="text-muted-foreground text-lg italic">Moderate and manage all beauty listings.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-12 h-12 rounded-full border-none bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="rounded-[3rem] border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/20 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="px-8 py-6 text-left">Product</th>
                  <th className="px-8 py-6 text-left">Category</th>
                  <th className="px-8 py-6 text-left">Price</th>
                  <th className="px-8 py-6 text-left">Stock</th>
                  <th className="px-8 py-6 text-left">Rating</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts?.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden border bg-secondary/20">
                          <Image 
                            src={product.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/100/100'} 
                            alt={product.title} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-[200px]">
                          <p className="font-bold text-sm truncate">{product.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold truncate">By {product.sellerName || 'Verified Seller'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[8px] font-bold px-3">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 font-bold text-sm">₦{(product.price || 0).toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "text-xs font-bold",
                        (product.stock || 0) < 5 ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {product.stock || 0} left
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1 text-yellow-600 font-bold text-xs">
                        <Star className="h-3 w-3 fill-current" />
                        {product.averageRating || 5.0}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteProduct(product.id)}
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

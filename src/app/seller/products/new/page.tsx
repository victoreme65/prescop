
'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Wallet, Sparkles, Upload, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateProductDescription } from '@/ai/flows/generate-product-description-flow';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AddProductPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    features: ''
  });

  const sidebarItems = [
    { title: 'Overview', href: '/seller/dashboard', icon: LayoutDashboard },
    { title: 'My Products', href: '/seller/products', icon: Package },
    { title: 'Orders', href: '/seller/orders', icon: ShoppingCart },
    { title: 'Earnings', href: '/seller/earnings', icon: Wallet },
    { title: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
  ];

  const handleAiGeneration = async () => {
    if (!formData.name) {
      toast({
        variant: 'destructive',
        title: 'Product Name Required',
        description: 'Please enter a product name first.'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateProductDescription({
        productName: formData.name,
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : undefined,
        keywords: ['beauty', 'skincare', 'premium', formData.category.toLowerCase()]
      });
      
      setFormData(prev => ({ ...prev, description: result.description }));
      toast({
        title: 'Description Generated!',
        description: 'AI has enhanced your product description.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate description. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-secondary/10 min-h-screen">
      <DashboardSidebar items={sidebarItems} title="Seller Panel" />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <Link href="/seller/dashboard" className="flex items-center gap-2 text-primary hover:underline text-sm mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="font-headline text-3xl font-bold">List a New Product</h1>
          <p className="text-muted-foreground">Fill in the details to showcase your beauty product.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us what you're selling.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Ultra Hydrating Rose Serum" 
                    className="rounded-xl border-secondary"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(v) => setFormData({...formData, category: v})}>
                      <SelectTrigger className="rounded-xl border-secondary">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Skincare">Skincare</SelectItem>
                        <SelectItem value="Makeup">Makeup</SelectItem>
                        <SelectItem value="Fragrance">Fragrance</SelectItem>
                        <SelectItem value="Bodycare">Bodycare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (₦)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      placeholder="0.00" 
                      className="rounded-xl border-secondary"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="stock">Available Stock</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    placeholder="e.g. 50" 
                    className="rounded-xl border-secondary w-full md:w-1/2"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Product Description</CardTitle>
                  <CardDescription>Write a compelling story for your product.</CardDescription>
                </div>
                <Button 
                  type="button"
                  variant="outline" 
                  className="rounded-full border-accent text-accent hover:bg-accent hover:text-white gap-2"
                  onClick={handleAiGeneration}
                  disabled={loading}
                >
                  <Sparkles className="h-4 w-4" />
                  {loading ? 'Generating...' : 'Enhance with AI'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="features">Key Features (comma separated)</Label>
                  <Input 
                    id="features" 
                    placeholder="e.g. Vegan, Organic, 24h Hydration" 
                    className="rounded-xl border-secondary"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your product's benefits and usage..." 
                    className="min-h-[200px] rounded-2xl border-secondary"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="ghost" asChild className="rounded-full px-8">
                <Link href="/seller/dashboard">Cancel</Link>
              </Button>
              <Button className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                Publish Product
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>High quality images attract more buyers.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-2xl border-2 border-dashed border-secondary flex flex-col items-center justify-center gap-4 text-muted-foreground hover:bg-secondary/20 cursor-pointer transition-colors">
                  <Upload className="h-10 w-10" />
                  <div className="text-center p-4">
                    <p className="font-bold text-foreground">Click to upload</p>
                    <p className="text-xs">Supports: JPG, PNG, WEBP</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-square rounded-lg bg-secondary/30" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Seller Tip</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground italic">
                "Products with 3 or more high-quality images and a detailed AI-enhanced description are 60% more likely to be purchased."
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}


import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Wallet, Plus, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SellerDashboard() {
  const sidebarItems = [
    { title: 'Overview', href: '/seller/dashboard', icon: LayoutDashboard },
    { title: 'My Products', href: '/seller/products', icon: Package },
    { title: 'Orders', href: '/seller/orders', icon: ShoppingCart },
    { title: 'Earnings', href: '/seller/earnings', icon: Wallet },
    { title: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
  ];

  return (
    <div className="flex bg-secondary/10 min-h-screen">
      <DashboardSidebar items={sidebarItems} title="Seller Panel" />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-headline text-3xl font-bold">Welcome back, Zainab!</h1>
            <p className="text-muted-foreground">Here is what's happening with your store today.</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 rounded-full gap-2">
            <Link href="/seller/products/new">
              <Plus className="h-4 w-4" /> Add New Product
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦450,200</div>
              <p className="text-xs text-green-500 font-medium">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-green-500 font-medium">+5 new today</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">3 out of stock</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">Based on 156 reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-white border flex items-center justify-center font-bold text-xs">
                        #{1024 + i}
                      </div>
                      <div>
                        <p className="font-bold text-sm">Customer Name {i}</p>
                        <p className="text-xs text-muted-foreground">₦15,000 • 2 items</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-600 border-none px-3">Processing</Badge>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-4 text-primary font-bold">View All Orders</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Performance Highlights</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Analytics chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </div>
  );
}

'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Truck, ShieldCheck, RefreshCcw, MapPin } from 'lucide-react';

export default function ShippingPage() {
  const policies = [
    {
      title: 'Nationwide Delivery',
      description: 'We deliver to all 36 states in Nigeria. Express shipping is available for major cities like Lagos, Abuja, and Port Harcourt.',
      icon: MapPin,
    },
    {
      title: 'Processing Time',
      description: 'Orders are typically processed by our sellers within 24-48 hours. You will receive a tracking link once your order has shipped.',
      icon: Truck,
    },
    {
      title: 'Secure Packaging',
      description: 'We ensure all beauty products are professionally packed to prevent leakage or damage during transit.',
      icon: ShieldCheck,
    },
    {
      title: 'Easy Returns',
      description: 'If you receive a damaged or incorrect item, you can initiate a return within 7 days of delivery for a full refund or exchange.',
      icon: RefreshCcw,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6">Shipping & Returns</h1>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            At Prescop, we prioritize getting your beauty essentials to you safely and quickly. Here's everything you need to know about our delivery and return policies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {policies.map((p, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-secondary/10 border border-secondary/20">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <p.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Estimated Delivery Times</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left text-sm uppercase tracking-widest text-muted-foreground">
                    <th className="py-4 font-bold">Region</th>
                    <th className="py-4 font-bold">Standard Delivery</th>
                    <th className="py-4 font-bold">Express Delivery</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-4 font-bold">Lagos</td>
                    <td className="py-4">1-2 Business Days</td>
                    <td className="py-4 text-primary font-bold">Next Day</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 font-bold">West / North / East</td>
                    <td className="py-4">3-5 Business Days</td>
                    <td className="py-4 text-primary font-bold">2-3 Days</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold">Remote Areas</td>
                    <td className="py-4">5-7 Business Days</td>
                    <td className="py-4">N/A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 max-w-4xl">
        <h1 className="font-headline text-4xl md:text-6xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-pink dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p>Welcome to Prescop. These Terms of Service govern your use of our website and marketplace platform. By accessing or using Prescop, you agree to be bound by these terms.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Marketplace Platform</h2>
            <p>Prescop acts as a multi-vendor marketplace connecting beauty vendors with customers. While we vet our sellers, the actual contract for sale is directly between the buyer and the seller.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Selling on Prescop</h2>
            <p>Sellers must provide authentic products. Counterfeit items are strictly prohibited and will lead to immediate account termination. Sellers are responsible for their own inventory and shipping within agreed timelines.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Payments</h2>
            <p>All payments are processed securely. Funds are held in escrow and released to sellers only after successful delivery is confirmed or the return period has elapsed.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Limitation of Liability</h2>
            <p>Prescop shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

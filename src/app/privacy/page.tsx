'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 max-w-4xl">
        <h1 className="font-headline text-4xl md:text-6xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-pink dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with our support team. This includes your name, email, phone number, and shipping address.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
            <p>We use your data to process orders, facilitate seller-customer communication, improve our marketplace experience, and send marketing communications if you have opted in.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Sharing</h2>
            <p>We share your shipping information with vendors and logistics partners to fulfill your orders. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Security</h2>
            <p>We implement industry-standard security measures to protect your data. Payment information is handled by secure, PCI-compliant payment gateways.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. You can manage these settings through your account dashboard or by contacting us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies</h2>
            <p>We use cookies to enhance your browsing experience and analyze site traffic. You can control cookie settings through your browser preferences.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

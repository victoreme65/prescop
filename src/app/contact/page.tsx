'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export default function ContactPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Message Sent!', description: "We've received your query and will get back to you shortly." });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Info */}
            <div className="space-y-12 text-center lg:text-left">
              <div className="space-y-6">
                <h1 className="font-headline text-4xl md:text-7xl font-bold tracking-tight">Get in <span className="text-primary italic">Touch</span></h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Have a question about an order, a vendor, or want to partner with us? Our team is here to help.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">Email Us</h3>
                    <p className="text-muted-foreground">support@prescop.com</p>
                    <p className="text-xs text-primary font-bold mt-1">Typical response time: 2 hours</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">Call Us</h3>
                    <p className="text-muted-foreground">+234 800 PRESCOP</p>
                    <p className="text-xs text-muted-foreground mt-1">Mon - Sat: 9am - 6pm WAT</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">Visit Office</h3>
                    <p className="text-muted-foreground">No 12. Adetokunbo Ademola St, Victoria Island, Lagos</p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-accent/5 border border-accent/10 flex items-center gap-6">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-white">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-accent">Live Chat Available</h4>
                  <p className="text-xs text-muted-foreground">Connect with our support team instantly.</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 md:p-14 bg-white dark:bg-card rounded-[3rem] shadow-2xl shadow-primary/10 border border-border/50">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold text-xs uppercase tracking-widest opacity-60">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required className="h-12 rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest opacity-60">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required className="h-12 rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-bold text-xs uppercase tracking-widest opacity-60">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" required className="h-12 rounded-xl" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-bold text-xs uppercase tracking-widest opacity-60">Message</Label>
                  <Textarea id="message" placeholder="Type your message here..." required className="min-h-[150px] rounded-2xl" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 gap-3">
                  {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
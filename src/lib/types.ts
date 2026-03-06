
export type Role = 'customer' | 'seller' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: Role;
  createdAt: any;
  updatedAt: any;
}

export interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  phone: string;
  country: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  images?: string[]; 
  stock: number;
  rating?: number;
  averageRating?: number;
  numReviews?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: any;
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerLocation: string;
  comment: string;
  rating: number;
  customerImageUrl?: string;
  isApproved: boolean;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  subscriptionDate: any;
  isActive: boolean;
  source?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}

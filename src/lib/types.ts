export type Role = 'customer' | 'seller' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName?: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  category?: string;
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
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

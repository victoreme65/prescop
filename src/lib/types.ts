
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
  images: string[]; // Keep for backward compatibility with existing components
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
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderDate: string;
  createdAt: string;
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
}

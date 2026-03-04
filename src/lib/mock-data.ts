
import { Product, User, Review } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Amaka Obi', email: 'amaka@example.com', role: 'customer' },
  { id: 'u2', name: 'Zainab Beauty', email: 'zainab@example.com', role: 'seller' },
  { id: 'u3', name: 'Admin Prescop', email: 'admin@prescop.com', role: 'admin' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sellerId: 'u2',
    sellerName: 'Zainab Beauty',
    title: 'Radiance Glow Serum',
    description: 'A luxurious brightening serum infused with Vitamin C and hyaluronic acid for a radiant complexion.',
    price: 15500,
    category: 'Skincare',
    images: ['https://picsum.photos/seed/serum1/600/600'],
    stock: 50,
    rating: 4.8,
    numReviews: 24,
  },
  {
    id: 'p2',
    sellerId: 'u2',
    sellerName: 'Zainab Beauty',
    title: 'Velvet Rose Lipstick',
    description: 'Long-lasting matte finish lipstick in a sophisticated rose pink shade.',
    price: 8500,
    category: 'Makeup',
    images: ['https://picsum.photos/seed/lipstick1/600/600'],
    stock: 120,
    rating: 4.5,
    numReviews: 45,
  },
  {
    id: 'p3',
    sellerId: 'u4',
    sellerName: 'Lagos Glam',
    title: 'Hydrating Face Mist',
    description: 'Refreshing facial mist with rose water and aloe vera.',
    price: 6200,
    category: 'Skincare',
    images: ['https://picsum.photos/seed/mist1/600/600'],
    stock: 30,
    rating: 4.2,
    numReviews: 12,
  },
  {
    id: 'p4',
    sellerId: 'u2',
    sellerName: 'Zainab Beauty',
    title: 'Nude Silk Eyeshadow Palette',
    description: 'A curated palette of 12 highly pigmented earthy and rose tones.',
    price: 18000,
    category: 'Makeup',
    images: ['https://picsum.photos/seed/palette1/600/600'],
    stock: 15,
    rating: 4.9,
    numReviews: 89,
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userId: 'u1',
    userName: 'Amaka Obi',
    rating: 5,
    comment: 'Absolutely love this serum! My skin has never looked better.',
    createdAt: '2024-03-20',
  },
  {
    id: 'r2',
    productId: 'p1',
    userId: 'u5',
    userName: 'Chioma K.',
    rating: 4,
    comment: 'Good product, but the shipping took a bit longer than expected.',
    createdAt: '2024-03-18',
  }
];

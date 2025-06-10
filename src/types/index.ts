export interface Bid {
  id: string;
  bidder: string;
  amount: number;
  timestamp: Date;
  avatar: string;
  userId: string;
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  location: {
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
  details: {
    type: string;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    parking?: number;
    floor?: string;
    facing?: string;
    age?: string;
    condition?: string;
  };
  startingPrice: number;
  currentPrice: number;
  startTime: Date;
  endTime: Date;
  category: string;
  amenities: string[];
  status: 'upcoming' | 'active' | 'expired';
  createdBy: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isOnline: boolean;
  joinedAt: Date;
  kycVerified: boolean;
  city: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}
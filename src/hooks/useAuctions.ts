import { useState, useEffect, useCallback } from 'react';
import { AuctionItem, Bid, User } from '../types';

const MOCK_AUCTIONS: AuctionItem[] = [
  {
    id: '1',
    title: 'Luxury 3BHK Apartment in Bandra West',
    description: 'Premium 3BHK apartment with sea view in the heart of Bandra West. This property features modern amenities, spacious rooms, and is located in one of Mumbai\'s most sought-after neighborhoods.',
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    location: {
      area: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    },
    details: {
      type: 'Apartment',
      area: 1450,
      bedrooms: 3,
      bathrooms: 3,
      parking: 2,
      floor: '12th Floor',
      facing: 'West (Sea View)',
      age: '5 Years'
    },
    startingPrice: 2500000,
    currentPrice: 2500000,
    startTime: new Date(Date.now() - 30 * 60 * 1000),
    endTime: new Date(Date.now() + 60 * 60 * 1000),
    category: 'Real Estate',
    amenities: ['Swimming Pool', 'Gym', 'Club House', 'Security', 'Parking'],
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Vintage Rolex Submariner Watch',
    description: 'Authentic vintage Rolex Submariner in excellent condition. This timepiece represents luxury and precision craftsmanship.',
    images: [
      'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    location: {
      area: 'Central Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    details: {
      type: 'Watch',
      condition: 'Excellent',
      age: '15 Years'
    },
    startingPrice: 500000,
    currentPrice: 500000,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    category: 'Luxury Items',
    amenities: ['Certificate of Authenticity', 'Original Box', 'Warranty'],
    status: 'upcoming',
    createdBy: 'admin',
    createdAt: new Date('2024-01-02')
  },
  {
    id: '3',
    title: 'Classic BMW 3 Series',
    description: 'Well-maintained BMW 3 Series with low mileage. Perfect for car enthusiasts looking for luxury and performance.',
    images: [
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    location: {
      area: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034'
    },
    details: {
      type: 'Car',
      condition: 'Good',
      age: '8 Years'
    },
    startingPrice: 800000,
    currentPrice: 950000,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 30 * 60 * 1000),
    category: 'Automobiles',
    amenities: ['Service History', 'Insurance', 'Registration Papers'],
    status: 'expired',
    createdBy: 'admin',
    createdAt: new Date('2024-01-03')
  }
];

export const useAuctions = () => {
  const [auctions, setAuctions] = useState<AuctionItem[]>(MOCK_AUCTIONS);
  const [bids, setBids] = useState<{ [auctionId: string]: Bid[] }>({});

  // Update auction statuses based on time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setAuctions(prev => prev.map(auction => {
        if (now < auction.startTime) {
          return { ...auction, status: 'upcoming' as const };
        } else if (now > auction.endTime) {
          return { ...auction, status: 'expired' as const };
        } else {
          return { ...auction, status: 'active' as const };
        }
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const createAuction = useCallback((auctionData: Omit<AuctionItem, 'id' | 'currentPrice' | 'status' | 'createdAt'>) => {
    const newAuction: AuctionItem = {
      ...auctionData,
      id: Date.now().toString(),
      currentPrice: auctionData.startingPrice,
      status: new Date() < auctionData.startTime ? 'upcoming' : 'active',
      createdAt: new Date()
    };

    setAuctions(prev => [newAuction, ...prev]);
    return newAuction;
  }, []);

  const placeBid = useCallback((auctionId: string, amount: number, user: User) => {
    const bid: Bid = {
      id: Date.now().toString(),
      bidder: user.name,
      amount,
      timestamp: new Date(),
      avatar: user.avatar,
      userId: user.id
    };

    setBids(prev => ({
      ...prev,
      [auctionId]: [bid, ...(prev[auctionId] || [])]
    }));

    setAuctions(prev => prev.map(auction => 
      auction.id === auctionId 
        ? { ...auction, currentPrice: amount }
        : auction
    ));
  }, []);

  const getAuctionBids = useCallback((auctionId: string) => {
    return bids[auctionId] || [];
  }, [bids]);

  const getActiveAuctions = useCallback(() => {
    return auctions.filter(auction => auction.status === 'active');
  }, [auctions]);

  const getUpcomingAuctions = useCallback(() => {
    return auctions.filter(auction => auction.status === 'upcoming');
  }, [auctions]);

  const getExpiredAuctions = useCallback(() => {
    return auctions.filter(auction => auction.status === 'expired');
  }, [auctions]);

  return {
    auctions,
    createAuction,
    placeBid,
    getAuctionBids,
    getActiveAuctions,
    getUpcomingAuctions,
    getExpiredAuctions
  };
};
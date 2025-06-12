import { useState, useEffect, useCallback } from 'react';
import { AuctionItem, Bid, User } from '../types';
import { useRealTimeAuctions } from './useRealTimeAuctions';

export const useAuctions = () => {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [bids, setBids] = useState<{ [auctionId: string]: Bid[] }>({});
  const [loading, setLoading] = useState(true);

  const { 
    socket, 
    isConnected, 
    joinAuction, 
    leaveAuction 
  } = useRealTimeAuctions();

  // Initialize auctions
  useEffect(() => {
    const initializeAuctions = async () => {
      try {
        // Simulate API call to fetch auctions
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const initialAuctions: AuctionItem[] = [
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
            endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
            category: 'Real Estate',
            amenities: ['Swimming Pool', 'Gym', 'Club House', 'Security', 'Parking'],
            status: 'active',
            createdBy: 'admin',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '2',
            title: 'Modern 2BHK in Koramangala',
            description: 'Contemporary 2BHK apartment in Bangalore\'s tech hub with excellent connectivity and modern amenities.',
            images: [
              'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            location: {
              area: 'Koramangala',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560034'
            },
            details: {
              type: 'Apartment',
              area: 1200,
              bedrooms: 2,
              bathrooms: 2,
              parking: 1,
              floor: '8th Floor',
              facing: 'East',
              age: '3 Years'
            },
            startingPrice: 1800000,
            currentPrice: 1800000,
            startTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
            endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
            category: 'Real Estate',
            amenities: ['Gym', 'Security', 'Parking', 'Power Backup'],
            status: 'upcoming',
            createdBy: 'admin',
            createdAt: new Date('2024-01-02')
          }
        ];

        setAuctions(initialAuctions);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load auctions:', error);
        setLoading(false);
      }
    };

    initializeAuctions();
  }, []);

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

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewBid = (data: { auctionId: string; bid: Bid }) => {
      setBids(prev => ({
        ...prev,
        [data.auctionId]: [data.bid, ...(prev[data.auctionId] || [])]
      }));

      setAuctions(prev => prev.map(auction => 
        auction.id === data.auctionId 
          ? { ...auction, currentPrice: data.bid.amount }
          : auction
      ));
    };

    const handleAuctionUpdate = (updatedAuction: AuctionItem) => {
      setAuctions(prev => prev.map(auction => 
        auction.id === updatedAuction.id ? updatedAuction : auction
      ));
    };

    const handleNewAuction = (newAuction: AuctionItem) => {
      setAuctions(prev => [newAuction, ...prev]);
    };

    socket.on('newBid', handleNewBid);
    socket.on('auctionUpdate', handleAuctionUpdate);
    socket.on('newAuction', handleNewAuction);

    return () => {
      socket.off('newBid', handleNewBid);
      socket.off('auctionUpdate', handleAuctionUpdate);
      socket.off('newAuction', handleNewAuction);
    };
  }, [socket]);

  const createAuction = useCallback(async (auctionData: Omit<AuctionItem, 'id' | 'currentPrice' | 'status' | 'createdAt'>) => {
    try {
      const newAuction: AuctionItem = {
        ...auctionData,
        id: Date.now().toString(),
        currentPrice: auctionData.startingPrice,
        status: new Date() < auctionData.startTime ? 'upcoming' : 'active',
        createdAt: new Date()
      };

      // Emit to socket for real-time updates
      if (socket && isConnected) {
        socket.emit('createAuction', newAuction);
      }

      setAuctions(prev => [newAuction, ...prev]);
      return newAuction;
    } catch (error) {
      console.error('Failed to create auction:', error);
      throw error;
    }
  }, [socket, isConnected]);

  const placeBid = useCallback(async (auctionId: string, amount: number, user: User) => {
    try {
      const bid: Bid = {
        id: Date.now().toString(),
        bidder: user.name,
        amount,
        timestamp: new Date(),
        avatar: user.avatar,
        userId: user.id
      };

      // Emit to socket for real-time updates
      if (socket && isConnected) {
        socket.emit('placeBid', { auctionId, bid });
      }

      // Update local state immediately for better UX
      setBids(prev => ({
        ...prev,
        [auctionId]: [bid, ...(prev[auctionId] || [])]
      }));

      setAuctions(prev => prev.map(auction => 
        auction.id === auctionId 
          ? { ...auction, currentPrice: amount }
          : auction
      ));
    } catch (error) {
      console.error('Failed to place bid:', error);
      throw error;
    }
  }, [socket, isConnected]);

  const getAuctionBids = useCallback((auctionId: string) => {
    return bids[auctionId] || [];
  }, [bids]);

  const joinAuctionRoom = useCallback((auctionId: string) => {
    if (socket && isConnected) {
      joinAuction(auctionId);
    }
  }, [socket, isConnected, joinAuction]);

  const leaveAuctionRoom = useCallback((auctionId: string) => {
    if (socket && isConnected) {
      leaveAuction(auctionId);
    }
  }, [socket, isConnected, leaveAuction]);

  return {
    auctions,
    bids,
    loading,
    isConnected,
    createAuction,
    placeBid,
    getAuctionBids,
    joinAuctionRoom,
    leaveAuctionRoom
  };
};
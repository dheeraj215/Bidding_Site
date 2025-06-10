import React from 'react';
import { Clock, MapPin, Eye, Calendar } from 'lucide-react';
import { AuctionItem } from '../../types';

interface AuctionGridProps {
  auctions: AuctionItem[];
  onSelectAuction: (auction: AuctionItem) => void;
}

export const AuctionGrid: React.FC<AuctionGridProps> = ({ auctions, onSelectAuction }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (auctions.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions found</h3>
        <p className="text-gray-500">Check back later for new auctions.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction) => (
        <div
          key={auction.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelectAuction(auction)}
        >
          <div className="relative">
            <img
              src={auction.images[0]}
              alt={auction.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(auction.status)}`}>
                {auction.status}
              </span>
            </div>
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {auction.images.length} photos
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {auction.category}
              </span>
              {auction.status === 'active' && (
                <div className="flex items-center text-sm text-red-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {getTimeRemaining(auction.endTime)}
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {auction.title}
            </h3>
            
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              {auction.location.city}, {auction.location.state}
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {auction.description}
            </p>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  {auction.status === 'upcoming' ? 'Starting Price' : 'Current Bid'}
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(auction.currentPrice)}
                </p>
              </div>
              
              <button className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
            </div>
            
            {auction.status === 'upcoming' && (
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Starts: {auction.startTime.toLocaleDateString()} at {auction.startTime.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
import React, { useState } from 'react';
import { Gavel, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { AuctionItem, User } from '../../types';
import { AuctionGrid } from './AuctionGrid';
import { AuctionDetail } from './AuctionDetail';

interface UserDashboardProps {
  user: User;
  auctions: AuctionItem[];
  onPlaceBid: (auctionId: string, amount: number, user: User) => void;
  getAuctionBids: (auctionId: string) => any[];
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  auctions,
  onPlaceBid,
  getAuctionBids,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'expired'>('active');
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);

  const activeAuctions = auctions.filter(a => a.status === 'active');
  const upcomingAuctions = auctions.filter(a => a.status === 'upcoming');
  const expiredAuctions = auctions.filter(a => a.status === 'expired');

  const getCurrentAuctions = () => {
    switch (activeTab) {
      case 'active':
        return activeAuctions;
      case 'upcoming':
        return upcomingAuctions;
      case 'expired':
        return expiredAuctions;
      default:
        return activeAuctions;
    }
  };

  if (selectedAuction) {
    return (
      <AuctionDetail
        auction={selectedAuction}
        user={user}
        bids={getAuctionBids(selectedAuction.id)}
        onPlaceBid={onPlaceBid}
        onBack={() => setSelectedAuction(null)}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Gavel className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bidding Platform</h1>
                <p className="text-sm text-gray-500">Discover amazing auctions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Auctions</p>
                <p className="text-2xl font-bold text-gray-900">{activeAuctions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAuctions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Auctions</p>
                <p className="text-2xl font-bold text-gray-900">{auctions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Auctions ({activeAuctions.length})
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming ({upcomingAuctions.length})
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'expired'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Expired ({expiredAuctions.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Auction Grid */}
        <AuctionGrid
          auctions={getCurrentAuctions()}
          onSelectAuction={setSelectedAuction}
        />
      </div>
    </div>
  );
};
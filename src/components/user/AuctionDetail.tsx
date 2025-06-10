import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, Gavel, TrendingUp, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { AuctionItem, User, Bid } from '../../types';

interface AuctionDetailProps {
  auction: AuctionItem;
  user: User;
  bids: Bid[];
  onPlaceBid: (auctionId: string, amount: number, user: User) => void;
  onBack: () => void;
  onLogout: () => void;
}

export const AuctionDetail: React.FC<AuctionDetailProps> = ({
  auction,
  user,
  bids,
  onPlaceBid,
  onBack,
  onLogout
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState(auction.currentPrice + 100);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = auction.endTime.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, total: distance });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % auction.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + auction.images.length) % auction.images.length);
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount > auction.currentPrice && auction.status === 'active') {
      onPlaceBid(auction.id, bidAmount, user);
      setBidAmount(auction.currentPrice + 100);
    }
  };

  const quickBid = (increment: number) => {
    setBidAmount(auction.currentPrice + increment);
  };

  const isUrgent = timeLeft.total < 300000; // Less than 5 minutes
  const isCritical = timeLeft.total < 60000; // Less than 1 minute

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Auctions</span>
              </button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative aspect-w-16 aspect-h-10">
                <img
                  src={auction.images[currentImageIndex]}
                  alt={auction.title}
                  className="w-full h-80 object-cover"
                />
                
                {auction.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {auction.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute top-4 left-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    auction.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : auction.status === 'upcoming'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {auction.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Auction Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {auction.category}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {auction.location.city}, {auction.location.state}
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{auction.title}</h1>
              <p className="text-gray-600 mb-6">{auction.description}</p>

              {/* Details Grid */}
              {Object.keys(auction.details).some(key => auction.details[key as keyof typeof auction.details]) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {auction.details.type && (
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{auction.details.type}</p>
                    </div>
                  )}
                  {auction.details.area && (
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-medium">{auction.details.area} sq ft</p>
                    </div>
                  )}
                  {auction.details.condition && (
                    <div>
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="font-medium">{auction.details.condition}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Amenities */}
              {auction.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Features & Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {auction.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Bidding and Timer */}
          <div className="space-y-6">
            {/* Countdown Timer */}
            {auction.status === 'active' && (
              <div className={`bg-white rounded-lg shadow p-6 ${isCritical ? 'animate-pulse' : ''}`}>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      isCritical ? 'bg-red-100' : isUrgent ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      <Clock className={`h-6 w-6 ${
                        isCritical ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-blue-500'
                      }`} />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Auction Ends In</h3>
                  
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className={`text-2xl font-bold ${
                        isCritical ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        {timeLeft.days}
                      </div>
                      <div className="text-xs text-gray-500">Days</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${
                        isCritical ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        {timeLeft.hours}
                      </div>
                      <div className="text-xs text-gray-500">Hours</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${
                        isCritical ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        {timeLeft.minutes}
                      </div>
                      <div className="text-xs text-gray-500">Minutes</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${
                        isCritical ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        {timeLeft.seconds}
                      </div>
                      <div className="text-xs text-gray-500">Seconds</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Current Bid */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-1">Current Highest Bid</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(auction.currentPrice)}</p>
                <p className="text-sm text-gray-500">Starting price: {formatCurrency(auction.startingPrice)}</p>
              </div>

              {auction.status === 'active' && (
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Bid Amount
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={auction.currentPrice + 1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Minimum bid: {formatCurrency(auction.currentPrice + 1)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => quickBid(100)}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      +$100
                    </button>
                    <button
                      type="button"
                      onClick={() => quickBid(500)}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      +$500
                    </button>
                    <button
                      type="button"
                      onClick={() => quickBid(1000)}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      +$1,000
                    </button>
                    <button
                      type="button"
                      onClick={() => quickBid(5000)}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      +$5,000
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={bidAmount <= auction.currentPrice}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg font-medium"
                  >
                    <Gavel className="h-5 w-5 mr-2" />
                    Place Bid {formatCurrency(bidAmount)}
                  </button>
                </form>
              )}

              {auction.status === 'upcoming' && (
                <div className="text-center py-6">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Auction starts on</p>
                  <p className="font-medium">{auction.startTime.toLocaleDateString()} at {auction.startTime.toLocaleTimeString()}</p>
                </div>
              )}

              {auction.status === 'expired' && (
                <div className="text-center py-6">
                  <p className="text-red-600 font-medium">Auction Ended</p>
                  <p className="text-sm text-gray-500">Final bid: {formatCurrency(auction.currentPrice)}</p>
                </div>
              )}
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Bid History</h3>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{bids.length} bids</span>
                </div>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {bids.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No bids yet</p>
                ) : (
                  bids.map((bid, index) => (
                    <div
                      key={bid.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={bid.avatar}
                          alt={bid.bidder}
                          className="h-8 w-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-sm">{bid.bidder}</p>
                          <p className="text-xs text-gray-500">
                            {bid.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${index === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          {formatCurrency(bid.amount)}
                        </p>
                        {index === 0 && (
                          <p className="text-xs text-green-600">Highest</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
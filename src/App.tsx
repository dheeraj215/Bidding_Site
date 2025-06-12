import React, { useState } from 'react';
import { UserTypeSelection } from './components/UserTypeSelection';
import { AdminLogin } from './components/admin/AdminLogin';
import { UserLogin } from './components/user/UserLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserDashboard } from './components/user/UserDashboard';
import { useAuth } from './hooks/useAuth';
import { useAuctions } from './hooks/useAuctions';

type UserType = 'admin' | 'user' | null;

function App() {
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);
  const { isAuthenticated, user, loading, login, logout, error } = useAuth();
  const {
    auctions,
    createAuction,
    updateAuction,
    deleteAuction,
    placeBid,
    getAuctionBids,
    joinAuctionRoom,
    leaveAuctionRoom,
    isConnected,
    loading: auctionsLoading
  } = useAuctions();

  if (loading || auctionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading PropertyBazaar...</p>
        </div>
      </div>
    );
  }

  // Show user type selection if no type is selected and user is not authenticated
  if (!selectedUserType && !isAuthenticated) {
    return (
      <UserTypeSelection
        onSelectUserType={setSelectedUserType}
      />
    );
  }

  // Show login forms based on selected user type
  if (!isAuthenticated) {
    if (selectedUserType === 'admin') {
      return (
        <AdminLogin
          onLogin={login}
          onBack={() => setSelectedUserType(null)}
          loading={loading}
          error={error}
        />
      );
    } else if (selectedUserType === 'user') {
      return (
        <UserLogin
          onLogin={login}
          onBack={() => setSelectedUserType(null)}
          loading={loading}
          error={error}
        />
      );
    }
  }

  // Show dashboards based on user role
  if (user?.role === 'admin') {
    return (
      <AdminDashboard
        user={user}
        auctions={auctions}
        onCreateAuction={createAuction}
        onUpdateAuction={updateAuction}
        onDeleteAuction={deleteAuction}
        onLogout={() => {
          logout();
          setSelectedUserType(null);
        }}
      />
    );
  }

  return (
    <UserDashboard
      user={user!}
      auctions={auctions}
      isConnected={isConnected}
      onPlaceBid={placeBid}
      getAuctionBids={getAuctionBids}
      onJoinAuction={joinAuctionRoom}
      onLeaveAuction={leaveAuctionRoom}
      onLogout={() => {
        logout();
        setSelectedUserType(null);
      }}
    />
  );
}

export default App;
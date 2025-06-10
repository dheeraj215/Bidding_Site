import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useAuctions } from './hooks/useAuctions';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserDashboard } from './components/user/UserDashboard';

function App() {
  const { isAuthenticated, user, loading, login, register, logout, error } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  const {
    auctions,
    createAuction,
    placeBid,
    getAuctionBids
  } = useAuctions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return isLoginMode ? (
      <LoginForm
        onLogin={login}
        onSwitchToRegister={() => setIsLoginMode(false)}
        loading={loading}
        error={error}
      />
    ) : (
      <RegisterForm
        onRegister={register}
        onSwitchToLogin={() => setIsLoginMode(true)}
        loading={loading}
        error={error}
      />
    );
  }

  if (user?.role === 'admin') {
    return (
      <AdminDashboard
        user={user}
        auctions={auctions}
        onCreateAuction={createAuction}
        onLogout={logout}
      />
    );
  }

  return (
    <UserDashboard
      user={user!}
      auctions={auctions}
      onPlaceBid={placeBid}
      getAuctionBids={getAuctionBids}
      onLogout={logout}
    />
  );
}

export default App;
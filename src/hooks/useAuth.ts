import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('biddingPlatform_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false
        });
      } catch {
        localStorage.removeItem('biddingPlatform_user');
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string, userType: 'admin' | 'user') => {
    setError(null);
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate credentials
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create user based on type and credentials
      const user: User = {
        id: Date.now().toString(),
        name: userType === 'admin' ? 'Admin User' : extractNameFromEmail(email),
        email,
        phone: generatePhoneNumber(),
        avatar: generateAvatar(),
        isOnline: true,
        joinedAt: new Date(),
        kycVerified: userType === 'admin' ? true : Math.random() > 0.3,
        city: getRandomCity(),
        role: userType
      };

      localStorage.setItem('biddingPlatform_user', JSON.stringify(user));
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('biddingPlatform_user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false
    });
    setError(null);
  }, []);

  return {
    ...authState,
    login,
    logout,
    error,
    clearError: () => setError(null)
  };
};

// Helper functions
function extractNameFromEmail(email: string): string {
  const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Emma Davis'];
  return names[Math.floor(Math.random() * names.length)];
}

function generatePhoneNumber(): string {
  return `${Math.floor(Math.random() * 9000000000) + 1000000000}`;
}

function generateAvatar(): string {
  const avatarIds = [1222271, 614810, 1239291, 1043471, 1181686, 1181690];
  const id = avatarIds[Math.floor(Math.random() * avatarIds.length)];
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?w=100&h=100&fit=crop&crop=face`;
}

function getRandomCity(): string {
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'];
  return cities[Math.floor(Math.random() * cities.length)];
}
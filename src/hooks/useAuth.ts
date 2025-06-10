import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';

const MOCK_ADMIN: User = {
  id: 'admin',
  name: 'Admin User',
  email: 'admin@biddingplatform.com',
  phone: '9876543210',
  avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face',
  isOnline: true,
  joinedAt: new Date('2023-01-01'),
  kycVerified: true,
  city: 'Mumbai',
  role: 'admin'
};

const MOCK_USER: User = {
  id: 'user',
  name: 'John Doe',
  email: 'user@example.com',
  phone: '9876543211',
  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=100&h=100&fit=crop&crop=face',
  isOnline: true,
  joinedAt: new Date('2023-02-01'),
  kycVerified: true,
  city: 'Delhi',
  role: 'user'
};

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

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setAuthState(prev => ({ ...prev, loading: true }));

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Admin login
    if (email === 'admin@biddingplatform.com' && password === 'admin123') {
      localStorage.setItem('biddingPlatform_user', JSON.stringify(MOCK_ADMIN));
      setAuthState({
        isAuthenticated: true,
        user: MOCK_ADMIN,
        loading: false
      });
      return;
    }

    // User login
    if (email === 'user@example.com' && password === 'user123') {
      localStorage.setItem('biddingPlatform_user', JSON.stringify(MOCK_USER));
      setAuthState({
        isAuthenticated: true,
        user: MOCK_USER,
        loading: false
      });
      return;
    }

    // For demo purposes, create a new user for any other valid email/password
    if (email && password && password.length >= 6) {
      const names = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown'];
      const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'];
      
      const newUser: User = {
        id: Date.now().toString(),
        name: names[Math.floor(Math.random() * names.length)],
        email,
        phone: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        avatar: `https://images.pexels.com/photos/${1000000 + Math.floor(Math.random() * 1000000)}/pexels-photo-${1000000 + Math.floor(Math.random() * 1000000)}.jpeg?w=100&h=100&fit=crop&crop=face`,
        isOnline: true,
        joinedAt: new Date(),
        kycVerified: Math.random() > 0.3,
        city: cities[Math.floor(Math.random() * cities.length)],
        role: 'user'
      };
      
      localStorage.setItem('biddingPlatform_user', JSON.stringify(newUser));
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        loading: false
      });
      return;
    }

    setError('Invalid email or password');
    setAuthState(prev => ({ ...prev, loading: false }));
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, phone: string, city: string) => {
    setError(null);
    setAuthState(prev => ({ ...prev, loading: true }));

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@biddingplatform.com') {
      setError('An account with this email already exists');
      setAuthState(prev => ({ ...prev, loading: false }));
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      avatar: `https://images.pexels.com/photos/${1000000 + Math.floor(Math.random() * 1000000)}/pexels-photo-${1000000 + Math.floor(Math.random() * 1000000)}.jpeg?w=100&h=100&fit=crop&crop=face`,
      isOnline: true,
      joinedAt: new Date(),
      kycVerified: false,
      city,
      role: 'user'
    };

    localStorage.setItem('biddingPlatform_user', JSON.stringify(newUser));
    setAuthState({
      isAuthenticated: true,
      user: newUser,
      loading: false
    });
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
    register,
    logout,
    error,
    clearError: () => setError(null)
  };
};
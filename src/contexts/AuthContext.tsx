import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  riskAppetite: 'Conservative' | 'Moderate' | 'Aggressive';
  balance: number;
  isEmailVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
  isAuthenticated: boolean;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  riskAppetite: 'Conservative' | 'Moderate' | 'Aggressive';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock JWT token generation
  const generateJWT = (userData: User): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: userData.id,
      email: userData.email,
      role: userData.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = btoa(`${header}.${payload}.secret`);
    return `${header}.${payload}.${signature}`;
  };

  // Mock API calls
  const mockAPI = {
    login: async (email: string, password: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user database
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@investapp.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          riskAppetite: 'Moderate',
          balance: 100000,
          isEmailVerified: true,
          createdAt: '2023-01-01T00:00:00Z'
        },
        {
          id: '2',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          riskAppetite: 'Moderate',
          balance: 50000,
          isEmailVerified: true,
          createdAt: '2023-01-15T00:00:00Z'
        }
      ];

      const foundUser = mockUsers.find(u => u.email === email);
      if (!foundUser || password !== 'password123') {
        return { success: false, message: 'Invalid credentials' };
      }

      return { success: true, user: foundUser };
    },

    signup: async (userData: SignupData) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      if (existingUsers.find((u: User) => u.email === userData.email)) {
        return { success: false, message: 'User already exists' };
      }

      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        role: 'user',
        balance: 0,
        isEmailVerified: false,
        createdAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem('mockUsers', JSON.stringify(existingUsers));

      return { success: true, user: newUser };
    },

    resetPassword: async (email: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send an email
      console.log(`Password reset email sent to ${email}`);
      return { success: true, message: 'Password reset email sent' };
    },

    verifyOTP: async (email: string, otp: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock OTP verification
      if (otp === '123456') {
        return { success: true, message: 'OTP verified successfully' };
      }
      return { success: false, message: 'Invalid OTP' };
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await mockAPI.login(email, password);
      
      if (result.success && result.user) {
        const jwtToken = generateJWT(result.user);
        setUser(result.user);
        setToken(jwtToken);
        localStorage.setItem('authToken', jwtToken);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    setLoading(true);
    try {
      const result = await mockAPI.signup(userData);
      
      if (result.success && result.user) {
        const jwtToken = generateJWT(result.user);
        setUser(result.user);
        setToken(jwtToken);
        localStorage.setItem('authToken', jwtToken);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true, message: 'Account created successfully' };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Signup failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const result = await mockAPI.resetPassword(email);
      return result;
    } catch (error) {
      return { success: false, message: 'Password reset failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const result = await mockAPI.verifyOTP(email, otp);
      return result;
    } catch (error) {
      return { success: false, message: 'OTP verification failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      // Mock password update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (currentPassword !== 'password123') {
        return { success: false, message: 'Current password is incorrect' };
      }

      // Update user in localStorage
      if (user) {
        const updatedUser = { ...user };
        const updatedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const userIndex = updatedUsers.findIndex((u: User) => u.id === user.id);
        if (userIndex !== -1) {
          updatedUsers[userIndex] = updatedUser;
          localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
        }
      }

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      return { success: false, message: 'Password update failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update in mock database
      const updatedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const userIndex = updatedUsers.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        updatedUsers[userIndex] = updatedUser;
        localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
      }

      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      return { success: false, message: 'Profile update failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    resetPassword,
    verifyOTP,
    updatePassword,
    updateProfile,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Mock user data for development
  const mockUsers = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password123!',
      avatar: '',
    },
  ];

  // Store registered users from signup flow
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const storedUsers = localStorage.getItem('lifepilot_registered_users');
    return storedUsers ? JSON.parse(storedUsers) : mockUsers;
  });

  // Check for user authentication on initialization and window focus
  const checkAuthState = () => {
    const storedUser = localStorage.getItem('lifepilot_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        return true;
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('lifepilot_user');
      }
    }
    return false;
  };

  useEffect(() => {
    // Check if user is already logged in via localStorage
    checkAuthState();
    setIsLoading(false);
    
    // Add event listener for when the window regains focus
    const handleFocus = () => {
      checkAuthState();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Save registered users to localStorage
  useEffect(() => {
    localStorage.setItem('lifepilot_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check both mock users and registered users
      const foundUser = registeredUsers.find(
        u => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in context
      setUser(userWithoutPassword);
      
      // Store in localStorage for persistence
      localStorage.setItem('lifepilot_user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.firstName}!`,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const userExists = registeredUsers.some(u => u.email === email);
      if (userExists) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser = {
        id: String(registeredUsers.length + 1),
        firstName,
        lastName,
        email,
        password,
        avatar: '',
      };
      
      // Add to registered users
      setRegisteredUsers(prev => [...prev, newUser]);
      
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Auto login after signup
      setUser(userWithoutPassword);
      localStorage.setItem('lifepilot_user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lifepilot_user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists
      const userExists = registeredUsers.some(u => u.email === email);
      if (!userExists) {
        throw new Error('No account found with that email');
      }
      
      toast({
        title: "Reset link sent",
        description: "If your email is registered, you'll receive a password reset link.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Request failed",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we'd validate the token and update the password
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully. Please log in.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Reset failed",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

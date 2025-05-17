
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { User, AuthContextType } from '@/types/auth';
import { AuthService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for user authentication on initialization and window focus
  const checkAuthState = () => {
    const storedUser = AuthService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      return true;
    }
    return false;
  };

  useEffect(() => {
    // Check if user is already logged in
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authenticatedUser = await AuthService.verifyCredentials(email, password);
      
      // Store user in context
      setUser(authenticatedUser);
      
      // Store in localStorage for persistence
      AuthService.saveCurrentUser(authenticatedUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${authenticatedUser.firstName}!`,
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
      const newUser = await AuthService.registerUser(firstName, lastName, email, password);
      
      // Auto login after signup
      setUser(newUser);
      AuthService.saveCurrentUser(newUser);
      
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
    AuthService.removeCurrentUser();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await AuthService.forgotPassword(email);
      
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
      await AuthService.resetPassword(token, password);
      
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

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User } from '../types/auth';
import { checkPermission, getUserPermissions, isAdmin as checkIsAdmin } from '../services/permissionService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  hasPermission: (resource: string, action: 'read' | 'write' | 'delete' | 'admin') => boolean;
  userPermissions: { [key: string]: Array<'read' | 'write' | 'delete' | 'admin'> };
  updateUserRoles: (userId: string, roles: string[]) => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userPermissions, setUserPermissions] = useState<{ [key: string]: Array<'read' | 'write' | 'delete' | 'admin'> }>({});
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock API call - replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login with roles and permissions
      const mockUser: User = {
        id: '1',
        email: email,
        roles: [
          {
            id: '1',
            name: 'Admin',
            permissions: [
              {
                resource: 'user-manager',
                actions: ['read', 'write', 'delete', 'admin']
              },
              {
                resource: 'inventory-manager',
                actions: ['read', 'write', 'delete', 'admin']
              }
            ]
          }
        ]
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      setUserPermissions(getUserPermissions(mockUser));
      
      // Store token in localStorage - replace with your actual token
      localStorage.setItem('token', 'mock-jwt-token');
      
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      // Mock API call - replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Successfully signed up! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign up. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    toast.success('Successfully logged out!');
    navigate('/login');
  }, [navigate]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      // Mock API call - replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password reset link sent to your email!');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const hasPermission = useCallback((resource: string, action: 'read' | 'write' | 'delete' | 'admin'): boolean => {
    return checkPermission(user, resource, action);
  }, [user]);

  const isAdmin = useCallback((): boolean => {
    return checkIsAdmin(user);
  }, [user]);

  const updateUserRoles = useCallback(async (userId: string, roles: string[]) => {
    try {
      if (!isAdmin()) {
        throw new Error('Unauthorized: Only administrators can update user roles');
      }

      setIsLoading(true);
      // Mock API call - replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('User roles updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update user roles');
      }
      console.error('Update user roles error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        isLoading,
        login, 
        signup, 
        logout, 
        forgotPassword,
        hasPermission,
        userPermissions,
        updateUserRoles,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
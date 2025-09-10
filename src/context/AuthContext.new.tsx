import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User } from '../types/auth';
import { checkPermission, getUserPermissions } from '../services/permissionService';

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

  const hasPermission = useCallback((resource: string, action: 'read' | 'write' | 'delete' | 'admin'): boolean => {
    return checkPermission(user, resource, action);
  }, [user]);
const login = useCallback(async (email: string, password: string) => {
  try {
    setIsLoading(true);

    // Call your real API (replace with axios/fetch based on your setup)
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    // The backend should return user + token
    const loggedInUser: User = {
      id: data.user.id,
      email: data.user.email,
      userName: data.user.userName,
      roleId: data.user.roleId,
      admin: data.user.admin,
      roles: data.user.roles, // include roles + permissions
    };

    setUser(loggedInUser);
    setIsAuthenticated(true);
    setUserPermissions(getUserPermissions(loggedInUser));

    // Save JWT or session token
    localStorage.setItem("token", data.token);

    toast.success("Successfully logged in!");
    navigate("/dashboard");
  } catch (error) {
    toast.error("Failed to login. Please try again.");
    console.error("Login error:", error);
  } finally {
    setIsLoading(false);
  }
}, [navigate]);


  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
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
    setUserPermissions({});
    localStorage.removeItem('token');
    toast.success('Successfully logged out!');
    navigate('/login');
  }, [navigate]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
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
        userPermissions
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

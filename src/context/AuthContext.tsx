import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { User } from "../types/auth";
import { checkPermission, getUserPermissions, isAdmin as checkIsAdmin } from "../services/permissionService";
import { API_ENDPOINTS } from "../apis/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  hasPermission: (resource: string, action: "read" | "write" | "delete" | "admin") => boolean;
  userPermissions: { [key: string]: Array<"read" | "write" | "delete" | "admin"> };
  updateUserRoles: (userId: string, roles: string[]) => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userPermissions, setUserPermissions] = useState<{ [key: string]: Array<"read" | "write" | "delete" | "admin"> }>({});
  const navigate = useNavigate();

  // Persist user + tokens in localStorage
  const persistSession = (userData: User, tokens: { access_token: string; refresh_token: string; token_type?: string }) => {
    setUser(userData);
    setIsAuthenticated(true);
    setUserPermissions(getUserPermissions(userData));
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    localStorage.setItem("token_type", tokens.token_type?.trim() || "Bearer");
  };

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
      const { successful, data, message } = response.data;
      if (!successful) {
        toast.error(message || "Login failed");
        return;
      }
      // Build user object from API response
      const userData = {
        id: data.id,
        email,
        userName: data.userName,
        profileImage: data.profileImage,
        roleId: data.roleId,
        admin: data.admin,
        roles: [], // roles should be fetched from another endpoint if needed
      };
      persistSession(userData, {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: data.token_type || "Bearer"
      });
      toast.success(message || "Login successful!");
      
      // Get the redirect path from localStorage or default to dashboard
      const redirectPath = localStorage.getItem("redirectPath") || "/dashboard";
      localStorage.removeItem("redirectPath"); // Clear it after use
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const err = error as any;
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Auto-login on refresh
//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     const tokenType = localStorage.getItem("token_type") || "Bearer";
//     const storedUser = localStorage.getItem("user");

//     if (token && storedUser) {
//       setUser(JSON.parse(storedUser));
//       setIsAuthenticated(true);
//       setUserPermissions(getUserPermissions(JSON.parse(storedUser)));
//     } else if (token) {
//       (async () => {
//         try {
//           setIsLoading(true);
//           const response = await axios.get(API_ENDPOINTS.AUTH.ME, {
//             headers: { Authorization: `${tokenType} ${token}` },
//           });
//           const data = response.data;
//           const currentUser: User = { ...data };
//           persistSession(currentUser, { access_token: token, refresh_token: localStorage.getItem("refresh_token") || "", token_type: tokenType });
//         } catch (err) {
//           console.error("Auto-login failed:", err);
//           localStorage.clear();
//         } finally {
//           setIsLoading(false);
//         }
//       })();
//     }
//   }, []);


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      // First restore from localStorage immediately to prevent flash
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setUserPermissions(getUserPermissions(parsedUser));
      
      // Set axios default header for all requests
      axios.defaults.headers.common["Authorization"] = `${tokenType} ${token}`;

      // Then validate the token with the backend
      (async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(API_ENDPOINTS.AUTH.ME, {
            headers: { Authorization: `${tokenType} ${token}` },
          });
          
          // If the token is valid, update user data from the backend
          if (response.data) {
            const currentUser: User = { ...response.data };
            setUser(currentUser);
            setIsAuthenticated(true);
            setUserPermissions(getUserPermissions(currentUser));
            // Update stored user data
            localStorage.setItem("user", JSON.stringify(currentUser));
          }
        } catch (err) {
          console.error("Session validation failed:", err);
          // Only clear if it's an auth error (401/403)
          if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
            setUser(null);
            setIsAuthenticated(false);
            setUserPermissions({});
            localStorage.clear();
            delete axios.defaults.headers.common["Authorization"];
            navigate("/login");
          }
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [navigate]);

  // Logout
  const logout = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";
    try {
      setIsLoading(true);
      if (token) {
        await axios.post(API_ENDPOINTS.AUTH.LOGOUT, {}, { headers: { Authorization: `${tokenType} ${token}` } });
        toast.success("Successfully logged out!");
      }
      setUser(null);
      setIsAuthenticated(false);
      setUserPermissions({});
      localStorage.clear();
      delete axios.defaults.headers.common["Authorization"];
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed, clearing local session anyway.");
      setUser(null);
      setIsAuthenticated(false);
      setUserPermissions({});
      localStorage.clear();
      delete axios.defaults.headers.common["Authorization"];
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Signup
  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Successfully signed up! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to sign up. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Forgot password
  const forgotPassword = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password reset link sent to your email!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const hasPermission = useCallback((resource: string, action: "read" | "write" | "delete" | "admin") => checkPermission(user, resource, action), [user]);
  const isAdmin = useCallback(() => checkIsAdmin(user), [user]);

  const updateUserRoles = useCallback(async (userId: string, roles: string[]) => {
    try {
      if (!isAdmin()) throw new Error("Unauthorized: Only administrators can update user roles");
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("User roles updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user roles");
      console.error("Update user roles error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, signup, logout, forgotPassword, hasPermission, userPermissions, updateUserRoles, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

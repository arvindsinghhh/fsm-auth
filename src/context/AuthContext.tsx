import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User } from "../types/auth";
import { checkPermission, getUserPermissions, isAdmin as checkIsAdmin } from "../services/permissionService";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  hasPermission: (resource: string, action: "read" | "write" | "delete" | "admin") => boolean;
  userPermissions: { [key: string]: Array<"read" | "write" | "delete" | "admin"> };
  updateUserRoles: (userId: string, roles: string[]) => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
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
  const [userPermissions, setUserPermissions] = useState<{ [key: string]: Array<"read" | "write" | "delete" | "admin"> }>({});
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://192.168.1.40:8765/api/admin-service/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { successful, data, message } = response.data;

      if (!successful) {
        toast.error(message || "Login failed");
        return;
      }

      // Map API response to your User type
      const userData: User = {
        id: data.id,
        email,
        userName: data.userName,
        profileImage: data.profileImage,
        roleId: data.roleId,
        admin: data.admin,
        roles: [
          {
            id: data.roleId,
            name: data.admin ? "Admin" : "User",
            permissions: [], // extend later if needed
          },
        ],
      };

      setUser(userData);
      setIsAuthenticated(true);
      setUserPermissions(getUserPermissions(userData));

      // Store tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("token_type", data.token_type?.trim() || "Bearer");

      toast.success(message || "Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // 👇 Auto-login when app reloads
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const tokenType = localStorage.getItem("token_type") || "Bearer";

    if (token) {
      (async () => {
        try {
          setIsLoading(true);
          const response = await axios.get("http://localhost:8765/api/admin-service/auth/me", {
            headers: { Authorization: `${tokenType} ${token}` },
          });

          const data = response.data;
          const currentUser: User = {
            id: data.id,
            email: data.email,
            userName: data.userName,
            profileImage: data.profileImage,
            roleId: data.roleId,
            admin: data.admin,
            roles: data.roles || [],
          };

          setUser(currentUser);
          setIsAuthenticated(true);
          setUserPermissions(getUserPermissions(currentUser));
        } catch (err) {
          console.error("Auto-login failed:", err);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token_type");
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, []);

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

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setUserPermissions({});
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_type");
    toast.success("Successfully logged out!");
    navigate("/login");
  }, [navigate]);

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

  const hasPermission = useCallback((resource: string, action: "read" | "write" | "delete" | "admin"): boolean => {
    return checkPermission(user, resource, action);
  }, [user]);

  const isAdmin = useCallback((): boolean => {
    return checkIsAdmin(user);
  }, [user]);

  const updateUserRoles = useCallback(async (userId: string, roles: string[]) => {
    try {
      if (!isAdmin()) {
        throw new Error("Unauthorized: Only administrators can update user roles");
      }

      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("User roles updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update user roles");
      }
      console.error("Update user roles error:", error);
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
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  profileImage?: string;
}

interface AuthContextType {
  user: FarcasterUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if the user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/auth/farcaster/user");
        const data = await response.json();

        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to check auth status:", err);
        setError("Failed to check authentication status");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Check for login success in URL params (from redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get("login") === "success";
    const loginError = urlParams.get("error");

    if (loginError) {
      setError(`Authentication failed: ${loginError}`);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (loginSuccess) {
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    checkAuthStatus();
  }, []);

  const login = () => {
    // Redirect to the server-side auth endpoint
    window.location.href = "/api/auth/farcaster";
  };

  const logout = () => {
    // Call the logout endpoint
    window.location.href = "/api/auth/farcaster/logout";
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

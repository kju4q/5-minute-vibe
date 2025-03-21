"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthState {
  isLoggedIn: boolean;
  fid: string | null;
  username: string | null;
  displayName: string | null;
  profileImage: string | null;
  token: string | null;
}

interface AuthContextType {
  auth: AuthState;
  login: (userData: Partial<AuthState>) => void;
  logout: () => void;
  isLoading: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  fid: null,
  username: null,
  displayName: null,
  profileImage: null,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initialState);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth data on component mount
  useEffect(() => {
    const loadAuth = () => {
      try {
        const storedAuth = localStorage.getItem("farcaster_auth");
        if (storedAuth) {
          setAuth(JSON.parse(storedAuth));
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  const login = (userData: Partial<AuthState>) => {
    const newAuthState = {
      ...auth,
      ...userData,
      isLoggedIn: true,
    };

    setAuth(newAuthState);

    // Store auth data in localStorage
    try {
      localStorage.setItem("farcaster_auth", JSON.stringify(newAuthState));
    } catch (error) {
      console.error("Error storing auth data:", error);
    }
  };

  const logout = () => {
    setAuth(initialState);
    try {
      localStorage.removeItem("farcaster_auth");
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

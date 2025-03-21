"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { useSignIn, useProfile } from "@farcaster/auth-kit";

type FarcasterProfile = {
  isAuthenticated: boolean;
  profile?: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfp?: string;
  } | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  // Use refs to prevent infinite loops with profile state updates
  const profileRef = useRef<FarcasterProfile | null>(null);

  // Avoid unnecessary re-renders with a ref flag
  const initializedRef = useRef(false);

  // Only log once to prevent console spam
  const debugLogged = useRef(false);

  // Safely try to use the Farcaster hooks
  let farcasterSignIn;
  let farcasterProfile;

  try {
    // Attempt to use the Farcaster hooks
    farcasterSignIn = useSignIn({
      onSuccess: (data: any) => {
        console.log("Sign in success:", data);
        // Store auth data in localStorage
        if (data && typeof data === "object" && data.message) {
          const authData = {
            isAuthenticated: true,
            user: {
              fid: data.message.fid,
              username: data.message.username,
              displayName: data.message.displayName,
              pfp: data.message.pfpUrl,
            },
          };
          localStorage.setItem("farcaster-auth", JSON.stringify(authData));
        }
      },
      onError: (error) => {
        console.error("Sign in error:", error);
      },
    });
    farcasterProfile = useProfile();

    // Log authentication state directly from the hook
    console.log("AuthKit state:", {
      isAuthenticated: farcasterProfile?.isAuthenticated,
      hasProfile: !!farcasterProfile?.profile,
      profile: farcasterProfile?.profile,
    });

    // Store profile in ref to avoid dependency changes
    profileRef.current = farcasterProfile as FarcasterProfile;

    // Log the state only once for debugging
    if (!debugLogged.current && farcasterProfile) {
      console.log("Auth kit initialized:", {
        signIn: !!farcasterSignIn,
        profile: !!farcasterProfile,
      });
      debugLogged.current = true;
    }
  } catch (error) {
    console.error("Failed to initialize Farcaster auth:", error);
    farcasterSignIn = null;
    farcasterProfile = null;
  }

  // Check for auth state in localStorage on mount first
  useEffect(() => {
    if (typeof window !== "undefined" && !initializedRef.current) {
      const storedAuth = localStorage.getItem("farcaster-auth");
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          console.log("Found stored auth data:", authData);
          if (authData.isAuthenticated && authData.user) {
            setIsAuthenticated(true);
            setUser(authData.user);
            initializedRef.current = true;
          }
        } catch (e) {
          console.error("Failed to parse stored auth data");
          localStorage.removeItem("farcaster-auth");
        }
      } else {
        console.log("No stored auth data found");
      }
    }
  }, []);

  // Directly use the auth state from Farcaster and store it when authenticated
  useEffect(() => {
    if (farcasterProfile?.isAuthenticated && farcasterProfile?.profile) {
      console.log(
        "Setting authenticated state from direct check:",
        farcasterProfile.profile
      );

      // Update state
      setIsAuthenticated(true);
      const userInfo = {
        fid: farcasterProfile.profile.fid,
        username: farcasterProfile.profile.username,
        displayName: farcasterProfile.profile.displayName,
        pfp: farcasterProfile.profile.pfpUrl,
      };
      setUser(userInfo);

      // Store in localStorage for persistence
      const authData = {
        isAuthenticated: true,
        user: userInfo,
      };
      localStorage.setItem("farcaster-auth", JSON.stringify(authData));
    }
  }, [farcasterProfile?.isAuthenticated]);

  const login = () => {
    try {
      console.log("Attempting to sign in with Farcaster");
      if (farcasterSignIn?.signIn) {
        farcasterSignIn.signIn();
      } else {
        console.error("Farcaster sign in not available");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    try {
      setIsAuthenticated(false);
      setUser(null);

      if (typeof window !== "undefined") {
        localStorage.removeItem("farcaster-auth");
        // Don't reload, just clear the state
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { SignInButton, useProfile } from "@farcaster/auth-kit";
import Modal from "./Modal";

export default function FarcasterLogin() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Also directly check Farcaster auth kit state
  const farcasterProfile = useProfile();

  // Debug: log both our context state and direct Farcaster state
  useEffect(() => {
    console.log("FarcasterLogin component state:", {
      contextAuth: { isAuthenticated, user },
      directAuth: {
        isAuthenticated: farcasterProfile?.isAuthenticated,
        profile: farcasterProfile?.profile,
      },
    });
  }, [isAuthenticated, user, farcasterProfile?.isAuthenticated]);

  // Close modal automatically when user becomes authenticated
  useEffect(() => {
    if ((isAuthenticated && user) || farcasterProfile?.isAuthenticated) {
      if (isModalOpen) {
        console.log("Closing modal due to authentication");
        setIsModalOpen(false);
      }
    }
  }, [isAuthenticated, user, farcasterProfile?.isAuthenticated, isModalOpen]);

  const openLoginModal = () => {
    setError(null);
    setIsModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsModalOpen(false);
  };

  // If authenticated through either method, show user info
  if (isAuthenticated || farcasterProfile?.isAuthenticated) {
    // Get user info from our context or directly from Farcaster
    const userInfo = user || {
      fid: farcasterProfile?.profile?.fid,
      username: farcasterProfile?.profile?.username,
      displayName: farcasterProfile?.profile?.displayName,
      pfp: farcasterProfile?.profile?.pfpUrl,
    };

    return (
      <div className="flex items-center gap-4">
        {userInfo.pfp && (
          <img
            src={userInfo.pfp}
            alt={userInfo.displayName || userInfo.username || "Profile"}
            className="w-8 h-8 rounded-full object-cover border-2 border-pink-100"
          />
        )}
        <span className="text-xs font-medium">
          {userInfo.displayName || userInfo.username || `fid:${userInfo.fid}`}
        </span>
        <button
          onClick={logout}
          className="text-xs bg-secondary/70 hover:bg-white text-text py-0.5 px-2 rounded-full transition-all duration-300 transform active:scale-95 font-soft cursor-pointer"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={openLoginModal}
        className="text-sm bg-pink-100 hover:bg-pink-200 text-text font-medium py-1 px-3 rounded-full transition-all duration-300 transform active:scale-95 font-soft cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
      >
        Login with Farcaster
      </button>

      <Modal isOpen={isModalOpen} onClose={closeLoginModal}>
        <div className="p-6 bg-primary/10 rounded-2xl shadow-lg w-full border border-primary/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-accent font-soft">
              Login with Farcaster
            </h2>
            <button
              onClick={closeLoginModal}
              className="text-text/50 hover:text-text transition-colors cursor-pointer hover:bg-white/30 hover:backdrop-blur-sm p-1 rounded-full"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-gray-100 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 py-4">
            <div className="flex justify-center items-center bg-white/80 rounded-lg py-8 px-6">
              <SignInButton />
            </div>

            <button
              onClick={closeLoginModal}
              className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80 text-text font-medium rounded-lg transition-all duration-300 font-soft cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

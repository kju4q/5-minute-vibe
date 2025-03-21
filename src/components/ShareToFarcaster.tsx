"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/auth";
import { useProfile } from "@farcaster/auth-kit";

// Types
interface ShareToFarcasterProps {
  isOpen: boolean;
  onClose: () => void;
  section: string;
  content: string;
}

export default function ShareToFarcaster({
  isOpen,
  onClose,
  section,
  content,
}: ShareToFarcasterProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [hasFarcasterExtension, setHasFarcasterExtension] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Get auth state from both our context and Farcaster directly
  const { isAuthenticated, login } = useAuth();
  const farcasterProfile = useProfile();

  // Combined auth check
  const isFarcasterAuthenticated =
    isAuthenticated || farcasterProfile?.isAuthenticated;

  // Check if content is empty
  const isContentEmpty = content.trim() === "";

  // Handle portal mounting
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Check if the Farcaster extension is available when modal opens
  useEffect(() => {
    if (isOpen) {
      const hasFarcaster = typeof window !== "undefined" && !!window.farcaster;
      console.log("Farcaster extension detected:", hasFarcaster);
      setHasFarcasterExtension(hasFarcaster);
      setShareSuccess(false);
      setShareError(null);
      setIsSharing(false);
    }
  }, [isOpen]);

  // Format post for sharing
  const getFormattedPost = () => {
    let text = "";

    if (section === "gratitude") {
      text = `I'm grateful for: ${content}\n`;
    } else if (section === "goals") {
      text = `My goal for today: ${content}\n`;
    } else if (section === "affirmations") {
      text = `Daily affirmation: ${content}\n`;
    } else {
      text = content;
    }

    return `${text}\n#5MinJournal`;
  };

  // Share via Warpcast extension
  const shareViaExtension = async () => {
    try {
      console.log("Publishing cast with Farcaster extension");
      if (typeof window !== "undefined" && window.farcaster) {
        const response = await window.farcaster.publishCast({
          text: getFormattedPost(),
        });
        console.log("Publishing response:", response);
        return { success: true, data: response };
      } else {
        throw new Error("Farcaster extension not available");
      }
    } catch (error) {
      console.error("Error with Farcaster extension:", error);
      return { success: false, error };
    }
  };

  // Open Warpcast web app
  const openWarpcast = () => {
    try {
      const encodedText = encodeURIComponent(getFormattedPost());
      const warpcastUrl = `https://warpcast.com/~/compose?text=${encodedText}`;
      window.open(warpcastUrl, "_blank");
      return { success: true, data: { message: "Opened in Warpcast" } };
    } catch (error) {
      console.error("Error opening Warpcast:", error);
      return { success: false, error };
    }
  };

  // Main share handler
  const handleShare = async () => {
    if (!isFarcasterAuthenticated) {
      console.log("Not authenticated, triggering login");
      login();
      return;
    }

    setIsSharing(true);
    setShareError(null);
    try {
      let result;

      if (hasFarcasterExtension) {
        result = await shareViaExtension();
      } else {
        // Use fallback method - try opening Warpcast
        result = openWarpcast();
      }

      if (result.success) {
        console.log("Share successful:", result);
        setShareSuccess(true);
        setTimeout(() => {
          onClose();
          setShareSuccess(false);
        }, 2000);
      } else {
        console.error("Share failed:", result);
        setShareError("Failed to share. Please try again.");
      }
    } catch (error) {
      console.error("Error sharing to Farcaster:", error);
      setShareError("An error occurred while sharing.");
    } finally {
      setIsSharing(false);
    }
  };

  // Close modal when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  // Create modal content
  const modalContent = (
    <div
      className="fixed inset-0 bg-primary/30 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn"
      onClick={handleClickOutside}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        ref={modalRef}
        className="bg-primary/10 rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 my-6 animate-popIn relative border border-primary/20"
        style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-accent font-soft">
            Share to Farcaster
          </h3>
          <button
            onClick={onClose}
            className="text-text/50 hover:text-text transition-colors cursor-pointer hover:bg-white/30 hover:backdrop-blur-sm"
          >
            ✕
          </button>
        </div>

        <div className="py-4">
          <div className="bg-white/80 rounded-lg p-4 mb-4 border border-primary/30">
            <p className="text-text/90 whitespace-pre-wrap">
              {getFormattedPost()}
            </p>
          </div>

          {!isFarcasterAuthenticated && (
            <div className="mb-4 p-3 bg-gray-100 border border-gray-200 text-text/80 rounded-lg text-sm">
              You need to log in with Farcaster first to share your entry.
            </div>
          )}

          {isContentEmpty && (
            <div className="mb-4 p-3 bg-gray-100 border border-gray-200 text-text/80 rounded-lg text-sm">
              There's nothing to share. Please add some content first.
            </div>
          )}

          {shareError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {shareError}
            </div>
          )}

          {shareSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {hasFarcasterExtension
                ? "Shared successfully!"
                : "Ready to share!"}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {/* Main share button */}
            <button
              onClick={handleShare}
              disabled={
                isSharing || !isFarcasterAuthenticated || isContentEmpty
              }
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 font-soft flex items-center justify-center ${
                shareSuccess
                  ? "bg-green-500 text-white cursor-pointer hover:bg-green-400 hover:shadow-md"
                  : isSharing || !isFarcasterAuthenticated || isContentEmpty
                  ? "bg-pink-100/70 text-text/60 border border-pink-200/50 cursor-not-allowed"
                  : "bg-pink-200 hover:bg-pink-300 text-text cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
              }`}
            >
              {isSharing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sharing...
                </span>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  {hasFarcasterExtension
                    ? "Share with Farcaster"
                    : "Open in Warpcast"}
                </>
              )}
            </button>

            {/* Cancel button */}
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80 text-text font-medium rounded-lg transition-all duration-300 font-soft cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render at the root level
  return createPortal(modalContent, document.body);
}

// Define the Farcaster global type
declare global {
  interface Window {
    farcaster?: {
      publishCast: (params: { text: string }) => Promise<any>;
    };
  }
}

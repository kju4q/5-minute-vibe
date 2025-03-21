"use client";

import { ReactNode, useEffect, useState } from "react";
import { AuthProvider } from "@/context/auth";
import FarcasterAuthKitProvider from "@/providers/FarcasterAuthKitProvider";
import "@farcaster/auth-kit/styles.css";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <FarcasterAuthKitProvider>
      <AuthProvider>{children}</AuthProvider>
    </FarcasterAuthKitProvider>
  );
}

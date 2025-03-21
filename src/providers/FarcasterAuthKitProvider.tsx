"use client";

import { ReactNode, useEffect, useState } from "react";
import { AuthKitProvider } from "@farcaster/auth-kit";

export default function FarcasterAuthKitProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [config, setConfig] = useState({
    domain: "5minutevibe.vercel.app",
    siweUri: "https://5minutevibe.vercel.app/api/siwe",
    rpcUrl: "https://mainnet.optimism.io",
    relay: "https://relay.farcaster.xyz",
    version: "v1",
    debug: false, // Set to false for production
  });

  // Update config based on environment
  useEffect(() => {
    const isProd =
      typeof window !== "undefined" &&
      (window.location.hostname === "5minutevibe.vercel.app" ||
        window.location.hostname.includes("vercel.app"));

    if (!isProd) {
      // Update for local development
      setConfig({
        ...config,
        domain: window.location.host,
        siweUri: `${window.location.protocol}//${window.location.host}/api/siwe`,
        debug: true,
      });
    }

    console.log("AuthKit config:", config);
  }, []);

  return <AuthKitProvider config={config}>{children}</AuthKitProvider>;
}

import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "../providers/ClientProviders";

export const metadata: Metadata = {
  title: "5 Minute Vibe - Daily Journaling",
  description: "A simple journaling app to improve your day in just 5 minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <main className="min-h-screen bg-background text-text">
            {children}
          </main>
          {/* Portal container for modals */}
          <div id="modal-root"></div>
        </ClientProviders>
      </body>
    </html>
  );
}

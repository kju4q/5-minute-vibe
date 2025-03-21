"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ShareToFarcaster from "@/components/ShareToFarcaster";
import JournalSection from "@/app/components/JournalSection";
import { useAuth } from "@/context/auth";

interface JournalData {
  gratitude: string[];
  goals: string[];
  affirmations: string[];
}

export default function SharePage() {
  const searchParams = useSearchParams();
  const [journalData, setJournalData] = useState<JournalData | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    try {
      // Get the encoded data from the URL
      const encodedData = searchParams.get("data");
      if (encodedData) {
        // Decode and parse the data
        const decodedData = decodeURIComponent(encodedData);
        const parsed = JSON.parse(decodedData);
        setJournalData(parsed);
      }
    } catch (error) {
      console.error("Error parsing journal data:", error);
    }
  }, [searchParams]);

  const handleShareItem = (
    text: string,
    prefixText?: string,
    section: string = "journal"
  ) => {
    const formattedText = prefixText ? `${prefixText}: ${text}` : text;
    setSelectedText(formattedText);
    setIsShareModalOpen(true);
  };

  if (!journalData) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden"
        style={{ backgroundColor: "#FFF0F5" }}
      >
        {/* Background gradients */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none animate-fadeIn"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none animate-fadeIn"></div>

        {/* Decorative elements */}
        <div className="absolute top-1/3 right-[5%] w-32 h-32 rounded-full bg-primary/5 blur-3xl animate-fadeIn"></div>
        <div className="absolute bottom-1/4 left-[10%] w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-fadeIn"></div>

        <div className="text-center p-8 bg-white/80 backdrop-blur-xs rounded-2xl shadow-soft animate-fadeIn">
          <h1 className="text-2xl font-bold mb-4 text-accent">
            No Journal Data Found
          </h1>
          <p className="text-text/80 mb-6">
            The sharing link appears to be invalid or expired.
          </p>
          <Link
            href="/"
            className="bg-primary hover:bg-accent text-text font-medium py-2 px-6 rounded-full shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background py-6 md:py-12 relative overflow-hidden"
      style={{ backgroundColor: "#FFF0F5" }}
    >
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none animate-fadeIn"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none animate-fadeIn"></div>

      {/* Decorative elements */}
      <div className="absolute top-1/3 right-[5%] w-32 h-32 rounded-full bg-primary/5 blur-3xl animate-fadeIn"></div>
      <div className="absolute bottom-1/4 left-[10%] w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-fadeIn"></div>

      {/* Decorative text */}
      <div className="absolute top-[10%] left-[5%] text-4xl text-primary/20 font-cute rotate-[-12deg] animate-fadeIn">
        share
      </div>
      <div className="absolute bottom-[10%] right-[5%] text-4xl text-primary/20 font-cute rotate-[10deg] animate-fadeIn">
        journal
      </div>

      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-soft p-6 relative z-10 animate-fadeIn">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-text text-gradient">
              5 Min Vibes
            </h1>
            <p className="text-text/70">Daily journal entry shared with you</p>
          </div>

          <JournalSection
            title="Gratitude"
            items={journalData.gratitude}
            prefixText="I am grateful for"
          />

          <JournalSection
            title="Goals"
            items={journalData.goals}
            prefixText="Today would be great if"
          />

          <JournalSection
            title="Affirmations"
            items={journalData.affirmations}
            prefixText="I am"
          />

          <div className="flex flex-col items-center mt-8 space-y-4">
            <Link
              href="/"
              className="bg-secondary hover:bg-white text-text font-medium py-2 px-6 rounded-full shadow-sm transition-all duration-300 transform active:scale-95"
            >
              Create Your Own Journal
            </Link>

            {isAuthenticated && (
              <div className="mt-4">
                <div className="mb-2 text-center text-sm text-text/70">
                  Share to Farcaster
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {journalData.gratitude.map((item, i) =>
                    item.trim() ? (
                      <button
                        key={`g-${i}`}
                        onClick={() =>
                          handleShareItem(
                            item,
                            "I am grateful for",
                            "gratitude"
                          )
                        }
                        className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-full text-sm text-text/80 transition-all duration-300"
                      >
                        Gratitude {i + 1}
                      </button>
                    ) : null
                  )}

                  {journalData.goals.map((item, i) =>
                    item.trim() ? (
                      <button
                        key={`gl-${i}`}
                        onClick={() =>
                          handleShareItem(
                            item,
                            "Today would be great if",
                            "goals"
                          )
                        }
                        className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-full text-sm text-text/80 transition-all duration-300"
                      >
                        Goal {i + 1}
                      </button>
                    ) : null
                  )}

                  {journalData.affirmations.map((item, i) =>
                    item.trim() ? (
                      <button
                        key={`a-${i}`}
                        onClick={() =>
                          handleShareItem(item, "I am", "affirmations")
                        }
                        className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-full text-sm text-text/80 transition-all duration-300"
                      >
                        Affirmation {i + 1}
                      </button>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ShareToFarcaster
        section="journal"
        content={selectedText}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}

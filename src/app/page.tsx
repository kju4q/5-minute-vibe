"use client";

import { useState, useEffect } from "react";
import JournalEntry from "@/components/JournalEntry";
import { getRandomQuote, getFallbackQuote, Quote } from "@/data/quotes";
import { useAuth } from "@/context/auth";
import FarcasterLogin from "@/components/FarcasterLogin";
import BreathingCircle from "@/components/BreathingCircle";
import SocialLinks from "@/components/SocialLinks";

interface JournalData {
  gratitude: string[];
  goals: string[];
  affirmations: string[];
}

export default function Home() {
  const [date, setDate] = useState<string>("");
  const [displayDate, setDisplayDate] = useState<string>("");
  const [quote, setQuote] = useState<Quote>({
    text: "today's gratitude vibes...",
    author: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [journalData, setJournalData] = useState<JournalData>({
    gratitude: ["", "", ""],
    goals: ["", "", ""],
    affirmations: ["", "", ""],
  });
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create a fixed date reference for today
      const today = new Date();

      // Format for storage key (YYYY-MM-DD)
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      // Format for display
      const formattedDisplayDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Log for debugging
      console.log("Today's date:", formattedDate);
      console.log("Display date:", formattedDisplayDate);

      // Update state
      setDate(formattedDate);
      setDisplayDate(formattedDisplayDate);
    }
  }, []);

  useEffect(() => {
    if (!date) return; // Skip if date isn't set yet

    const fetchQuote = async () => {
      setIsLoading(true);
      try {
        // Use the date as a seed to ensure different quotes on different days
        const dailyQuote = await getRandomQuote(date);
        setQuote(dailyQuote);
      } catch (error) {
        console.error("Error fetching quote:", error);
        setQuote(getFallbackQuote());
      } finally {
        setIsLoading(false);
      }
    };

    // Load journal data from local storage for today
    const loadJournalData = () => {
      if (typeof window === "undefined") return;

      const savedData = localStorage.getItem(`journal_${date}`);
      if (savedData) {
        try {
          setJournalData(JSON.parse(savedData));
        } catch (error) {
          console.error("Error parsing saved journal data:", error);
        }
      } else {
        // Reset to empty if no data for today
        setJournalData({
          gratitude: ["", "", ""],
          goals: ["", "", ""],
          affirmations: ["", "", ""],
        });
      }
    };

    fetchQuote();
    loadJournalData();
  }, [date]);

  const handleJournalChange = (updatedData: JournalData) => {
    setJournalData(updatedData);

    // Save to today's journal entry
    if (date && typeof window !== "undefined") {
      try {
        localStorage.setItem(`journal_${date}`, JSON.stringify(updatedData));
      } catch (error) {
        console.error("Error saving journal data:", error);
      }
    }
  };

  return (
    <main
      className="min-h-screen bg-background py-6 md:py-12 overflow-hidden relative"
      style={{ backgroundColor: "#FFF0F5" }}
    >
      {/* Absolute positioned login at top right of entire page */}
      <div className="absolute top-4 right-4 z-50 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-soft">
        <FarcasterLogin />
      </div>

      {/* Background gradients and decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none animate-fadeIn"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none animate-fadeIn"></div>
      <div className="absolute top-1/4 right-[10%] w-32 h-32 rounded-full bg-primary/5 blur-3xl animate-fadeIn"></div>
      <div className="absolute bottom-1/3 left-[15%] w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-fadeIn"></div>

      {/* Social links component */}
      <SocialLinks />

      {/* Decorative text */}
      <div
        className="absolute top-[15%] left-[8%] text-4xl text-primary/20 font-cute rotate-[-10deg] animate-fadeIn"
        style={{ animationDuration: "2s", animationDelay: "0.7s" }}
      >
        grateful
      </div>
      <div
        className="absolute bottom-[15%] right-[8%] text-4xl text-primary/20 font-cute rotate-[8deg] animate-fadeIn"
        style={{ animationDuration: "2s", animationDelay: "0.9s" }}
      >
        vibes
      </div>

      <div className="container mx-auto max-w-2xl p-6">
        {/* Header with navigation */}
        <header className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-medium text-pink-500 font-cute mt-4">
            5 Minute Vibe
          </h1>

          {/* Today's Date Display */}
          <div className="mt-2 text-center">
            <p className="text-sm text-text/70">
              Journal Date: {displayDate || "Loading..."}
            </p>
          </div>
        </header>

        {/* Inspirational Quote */}
        <div className="bg-white/60 p-4 rounded-lg italic text-text shadow-soft mb-8">
          <blockquote className="relative">
            <p className="font-soft">{quote.text}</p>
            {quote.author && (
              <footer className="text-right text-sm mt-2 text-accent/70">
                — {quote.author}
              </footer>
            )}
          </blockquote>
        </div>

        <div className="bg-white/80 backdrop-blur-xs rounded-2xl shadow-soft overflow-hidden p-6 animate-fadeIn">
          <JournalEntry
            journalData={journalData}
            onChange={handleJournalChange}
          />
        </div>

        {/* Breathing Circle component */}
        <div className="mt-8 mb-8">
          <BreathingCircle />
        </div>
      </div>
    </main>
  );
}

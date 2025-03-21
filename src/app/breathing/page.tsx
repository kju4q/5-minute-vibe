"use client";

import { useState } from "react";
import Link from "next/link";
import BreathingCircle from "@/components/BreathingCircle";

export default function BreathingPage() {
  return (
    <div className="container mx-auto max-w-2xl p-6">
      <header className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-text/70 hover:text-text mb-6 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Journal
        </Link>

        <div className="text-center">
          <h1 className="text-2xl font-medium text-accent mb-3 font-soft">
            Mindful Breathing
          </h1>
          <p className="text-text/80 max-w-md mx-auto">
            Take a moment to breathe and center yourself. Regular breathing
            exercises can help reduce anxiety, improve focus, and promote
            relaxation.
          </p>
        </div>
      </header>

      <main className="bg-white/50 rounded-xl shadow-lg p-6 backdrop-blur-sm">
        <BreathingCircle />

        <div className="mt-8 border-t border-primary/20 pt-6">
          <h3 className="text-lg font-medium text-accent mb-3 font-soft">
            Benefits of Mindful Breathing
          </h3>

          <ul className="space-y-3 text-text/80">
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-pink-400 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                Reduces stress and anxiety by activating your parasympathetic
                nervous system
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-pink-400 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                Improves focus and concentration by bringing your attention to
                the present moment
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-pink-400 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                Lowers heart rate and blood pressure, promoting overall heart
                health
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-pink-400 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                Can improve sleep quality when practiced before bedtime
              </span>
            </li>
          </ul>

          <div className="mt-6 text-sm text-text/60 font-soft italic text-center">
            Practice for just 5 minutes daily to experience benefits
          </div>
        </div>
      </main>
    </div>
  );
}

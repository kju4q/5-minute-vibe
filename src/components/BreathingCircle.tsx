"use client";

import { useState, useEffect } from "react";

export default function BreathingCircle() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">(
    "inhale"
  );
  const [counter, setCounter] = useState(4);
  const [scale, setScale] = useState(1);
  const [isClient, setIsClient] = useState(false);

  // Only run animations on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Animate scale based on phase
    if (phase === "inhale") {
      setScale(1.5); // Expand during inhale
    } else if (phase === "exhale") {
      setScale(1); // Contract during exhale
    }

    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev === 1) {
          // Move to next phase
          switch (phase) {
            case "inhale":
              setPhase("hold");
              return 2; // Hold duration
            case "hold":
              setPhase("exhale");
              return 4; // Exhale duration
            case "exhale":
              setPhase("inhale");
              return 4; // Inhale duration
            default:
              return prev;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, counter, isClient]);

  // Text cue based on phase
  const getCueText = () => {
    if (!isClient) return "";
    switch (phase) {
      case "inhale":
        return "inhale";
      case "hold":
        return "hold";
      case "exhale":
        return "exhale";
      case "rest":
        return "";
      default:
        return "";
    }
  };

  // Animation class for text cue
  const getCueClass = () => {
    if (!isClient) return "";
    switch (phase) {
      case "inhale":
        return "opacity-90 animate-fadeIn";
      case "hold":
        return "opacity-90";
      case "exhale":
        return "opacity-80 animate-fadeOut";
      default:
        return "opacity-60";
    }
  };

  // Classes for circle animation based on phase
  const circleClasses = `
    rounded-full
    transition-all
    duration-1000
    flex
    items-center
    justify-center
    shadow-[0_0_8px_rgba(255,182,193,0.5)]
    ${!isClient ? "bg-gradient-to-r from-pink-100/80 to-pink-200/80" : ""}
    ${
      isClient && phase === "inhale"
        ? "bg-gradient-to-r from-pink-200/90 to-blue-100/90"
        : ""
    }
    ${
      isClient && phase === "hold"
        ? "bg-gradient-to-r from-blue-100/90 to-purple-100/90"
        : ""
    }
    ${
      isClient && phase === "exhale"
        ? "bg-gradient-to-r from-purple-100/90 to-pink-100/90"
        : ""
    }
  `;

  return (
    <div className="flex justify-center items-center mt-8">
      {/* Breathing circle with cues inside */}
      <div
        className="w-20 h-20"
        style={{
          transform: isClient ? `scale(${scale})` : "scale(1)",
          transition: "transform 1.5s ease-in-out",
        }}
      >
        <div
          className={circleClasses}
          style={{ width: "100%", height: "100%" }}
        >
          <div
            className={`text-[8px] px-2 text-pink-300 font-soft text-center font-light ${getCueClass()}`}
            style={{ maxWidth: "95%" }}
          >
            {getCueText()}
          </div>
        </div>
      </div>
    </div>
  );
}

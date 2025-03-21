"use client";

interface SharePreviewProps {
  date: string;
  quote: {
    text: string;
    author: string;
  };
  isLoading?: boolean;
}

export default function SharePreview({
  date,
  quote,
  isLoading = false,
}: SharePreviewProps) {
  return (
    <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xs shadow-soft p-6 transition-all duration-300 hover:shadow-hover animate-fadeIn">
      <div className="text-center mb-4">
        <h2 className="text-xl font-medium text-text animate-fadeIn text-gradient">
          Journal Entry
        </h2>
        <p
          className="text-sm text-text/70 mt-1 animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          {new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      <div
        className="bg-primary/20 p-4 rounded-lg text-center italic mb-4 animate-fadeIn"
        style={{ animationDelay: "0.2s" }}
      >
        {isLoading ? (
          <div className="py-2 animate-pulse">
            <div className="h-4 bg-primary/20 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-primary/10 rounded w-1/2 mx-auto"></div>
          </div>
        ) : (
          <>
            <p className="text-sm text-text font-soft text-lg italic">
              "{quote.text}"
            </p>
            <p className="text-xs text-text/70 mt-1">— {quote.author}</p>
          </>
        )}
      </div>

      <div
        className="flex items-center justify-center flex-wrap gap-2 text-sm animate-fadeIn"
        style={{ animationDelay: "0.3s" }}
      >
        <span
          className="px-3 py-1 bg-primary/30 rounded-full text-text/80 transition-all duration-300 hover:bg-primary/40 animate-popIn font-soft"
          style={{ animationDelay: "0.4s" }}
        >
          Gratitude
        </span>
        <span
          className="px-3 py-1 bg-primary/30 rounded-full text-text/80 transition-all duration-300 hover:bg-primary/40 animate-popIn font-soft"
          style={{ animationDelay: "0.5s" }}
        >
          Goals
        </span>
        <span
          className="px-3 py-1 bg-primary/30 rounded-full text-text/80 transition-all duration-300 hover:bg-primary/40 animate-popIn font-soft"
          style={{ animationDelay: "0.6s" }}
        >
          Affirmations
        </span>
      </div>

      <div
        className="mt-4 text-center animate-fadeIn"
        style={{ animationDelay: "0.7s" }}
      >
        <p className="text-xs text-text/70">
          Shared via <span className="font-soft">5 Min Vibes</span> ✨
        </p>
      </div>
    </div>
  );
}

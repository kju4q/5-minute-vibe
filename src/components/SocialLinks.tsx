import React from "react";

export default function SocialLinks() {
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-10">
      <div className="flex gap-3 bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-soft animate-fadeIn">
        <a
          href="https://x.com/kjut4q"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400/80 hover:text-pink-500 transition-all transform hover:scale-110 cursor-pointer"
          aria-label="Twitter/X"
        >
          <div className="bg-white/40 p-1.5 rounded-full shadow-soft">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </a>
        <a
          href="https://warpcast.com/qendresa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400/80 hover:text-pink-500 transition-all transform hover:scale-110 cursor-pointer"
          aria-label="Farcaster"
        >
          <div className="bg-white/40 p-1.5 rounded-full shadow-soft">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zM8.42 15.89c0 .56-.46 1.02-1.02 1.02h-.46c-.56 0-1.02-.46-1.02-1.02v-4.06c0-.56.46-1.02 1.02-1.02h.46c.56 0 1.02.46 1.02 1.02v4.06zm5.08 0c0 .56-.46 1.02-1.02 1.02h-.46c-.56 0-1.02-.46-1.02-1.02v-4.06c0-.56.46-1.02 1.02-1.02h.46c.56 0 1.02.46 1.02 1.02v4.06zm5.08 0c0 .56-.46 1.02-1.02 1.02h-.46c-.56 0-1.02-.46-1.02-1.02v-4.06c0-.56.46-1.02 1.02-1.02h.46c.56 0 1.02.46 1.02 1.02v4.06zm.96-9.33c0 .28-.23.51-.51.51H6.97c-.28 0-.51-.23-.51-.51v-.25c0-.28.23-.51.51-.51h11.06c.28 0 .51.23.51.51v.25z" />
            </svg>
          </div>
        </a>
        <a
          href="https://qendresa.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400/80 hover:text-pink-500 transition-all transform hover:scale-110 cursor-pointer"
          aria-label="Personal Website"
        >
          <div className="bg-white/40 p-1.5 rounded-full shadow-soft">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
}

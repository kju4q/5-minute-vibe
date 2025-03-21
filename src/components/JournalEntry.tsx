"use client";

import { useState, KeyboardEvent } from "react";
import ShareToFarcaster from "./ShareToFarcaster";

// Define journal data type
export interface JournalData {
  gratitude: string[];
  goals: string[];
  affirmations: string[];
}

// Define component props
interface JournalEntryProps {
  journalData: JournalData;
  onChange: (data: JournalData) => void;
}

// Define section type
type Section = "gratitude" | "goals" | "affirmations" | "complete";

export default function JournalEntry({
  journalData,
  onChange,
}: JournalEntryProps) {
  // State for tracking current section
  const [currentSection, setCurrentSection] = useState<Section>("gratitude");
  const [error, setError] = useState<string | null>(null);

  // Share to Farcaster modal state
  const [sharingModalOpen, setSharingModalOpen] = useState(false);
  const [shareSection, setShareSection] = useState<Section>("gratitude");
  const [shareContent, setShareContent] = useState("");

  // Handle input changes
  const handleInputChange = (
    section: "gratitude" | "goals" | "affirmations",
    index: number,
    value: string
  ) => {
    const updatedData = {
      ...journalData,
      [section]: journalData[section].map((item, i) =>
        i === index ? value : item
      ),
    };
    onChange(updatedData);
  };

  // Handle keyboard navigation
  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>,
    section: "gratitude" | "goals" | "affirmations",
    index: number
  ) => {
    // If Enter is pressed, move to the next field
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // If we're at the last field in the section, move to the next section
      if (index === journalData[section].length - 1) {
        validateAndContinue();
      } else {
        // Focus the next input in the same section
        const nextInput = document.getElementById(`${section}-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Validate and continue to next section
  const validateAndContinue = () => {
    let isValid = false;

    switch (currentSection) {
      case "gratitude":
        isValid = journalData.gratitude.some((item) => item.trim().length > 0);
        if (isValid) {
          setCurrentSection("goals");
          setError(null);
        } else {
          setError("Please enter at least one thing you're grateful for");
        }
        break;

      case "goals":
        isValid = journalData.goals.some((item) => item.trim().length > 0);
        if (isValid) {
          setCurrentSection("affirmations");
          setError(null);
        } else {
          setError("Please enter at least one goal for today");
        }
        break;

      case "affirmations":
        isValid = journalData.affirmations.some(
          (item) => item.trim().length > 0
        );
        if (isValid) {
          setCurrentSection("complete");
          setError(null);
        } else {
          setError("Please enter at least one affirmation");
        }
        break;

      default:
        break;
    }
  };

  // Go back to previous section
  const goBack = () => {
    switch (currentSection) {
      case "goals":
        setCurrentSection("gratitude");
        break;
      case "affirmations":
        setCurrentSection("goals");
        break;
      case "complete":
        setCurrentSection("affirmations");
        break;
      default:
        break;
    }
    setError(null);
  };

  // Reset to start over
  const startOver = () => {
    setCurrentSection("gratitude");
    setError(null);
  };

  // Open sharing modal for a specific section
  const openShareModal = (section: Section, index?: number) => {
    let contentToShare = "";

    if (typeof index === "number") {
      // Share a specific item
      if (section === "gratitude" && journalData.gratitude[index]?.trim()) {
        contentToShare = journalData.gratitude[index];
      } else if (section === "goals" && journalData.goals[index]?.trim()) {
        contentToShare = journalData.goals[index];
      } else if (
        section === "affirmations" &&
        journalData.affirmations[index]?.trim()
      ) {
        contentToShare = journalData.affirmations[index];
      }
    } else {
      // Share all items in a section
      if (section === "gratitude") {
        contentToShare = journalData.gratitude
          .filter((item) => item.trim())
          .join("\n");
      } else if (section === "goals") {
        contentToShare = journalData.goals
          .filter((item) => item.trim())
          .join("\n");
      } else if (section === "affirmations") {
        contentToShare = journalData.affirmations
          .filter((item) => item.trim())
          .join("\n");
      }
    }

    if (contentToShare) {
      setShareSection(section);
      setShareContent(contentToShare);
      setSharingModalOpen(true);
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fadeIn">
        {/* Gratitude Section */}
        {currentSection === "gratitude" && (
          <div className="animate-slideInRight">
            <h2 className="text-xl font-medium mb-3 text-accent font-soft">
              I am grateful for...
            </h2>
            <div className="space-y-2">
              {journalData.gratitude.map((item, index) => (
                <div key={`gratitude-${index}`} className="relative">
                  <textarea
                    id={`gratitude-${index}`}
                    value={item}
                    onChange={(e) =>
                      handleInputChange("gratitude", index, e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, "gratitude", index)}
                    placeholder={""}
                    className="w-full border border-primary/20 rounded-lg p-3 focus:ring-2 focus:ring-primary/30 focus:border-transparent transition-all duration-300 resize-none text-text grammarly-hide"
                    rows={1}
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                  />
                  {/* Add share button for individual item */}
                  {item.trim() && (
                    <button
                      onClick={() => openShareModal("gratitude", index)}
                      className="absolute right-3 top-3 text-xs bg-pink-100 hover:bg-pink-200 text-text p-1.5 rounded-full transition-all duration-300 cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
                      title="Share this gratitude"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.479m-9.566 7.665l9.566 5.479m0 0a2.25 2.25 0 100-4.372m0 4.372V7.686"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => openShareModal("gratitude")}
                className={`text-sm font-medium py-1 px-3 rounded-full transition-all duration-300 transform active:scale-95 font-soft ${
                  !journalData.gratitude.some((item) => item.trim())
                    ? "bg-pink-100/70 text-text/60 border border-pink-200/50 cursor-not-allowed"
                    : "bg-pink-100 hover:bg-pink-200 text-text cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
                }`}
                disabled={!journalData.gratitude.some((item) => item.trim())}
              >
                Share to Farcaster
              </button>
              <button
                onClick={validateAndContinue}
                className="bg-primary hover:bg-accent text-text font-medium py-2 px-6 rounded-full transition-all duration-300 transform active:scale-95 font-soft cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Goals Section */}
        {currentSection === "goals" && (
          <div className="animate-slideInRight">
            <h2 className="text-xl font-medium mb-3 text-accent font-soft">
              What would make today great?
            </h2>
            <div className="space-y-2">
              {journalData.goals.map((item, index) => (
                <div key={`goal-${index}`} className="relative">
                  <textarea
                    id={`goals-${index}`}
                    value={item}
                    onChange={(e) =>
                      handleInputChange("goals", index, e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, "goals", index)}
                    placeholder={""}
                    className="w-full border border-primary/20 rounded-lg p-3 focus:ring-2 focus:ring-primary/30 focus:border-transparent transition-all duration-300 resize-none text-text grammarly-hide"
                    rows={1}
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                  />
                  {/* Add share button for individual item */}
                  {item.trim() && (
                    <button
                      onClick={() => openShareModal("goals", index)}
                      className="absolute right-3 top-3 text-xs bg-pink-100 hover:bg-pink-200 text-text p-1.5 rounded-full transition-all duration-300 cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
                      title="Share this goal"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.479m-9.566 7.665l9.566 5.479m0 0a2.25 2.25 0 100-4.372m0 4.372V7.686"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="mt-4 flex justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={goBack}
                  className="bg-secondary hover:bg-white text-text font-medium py-2 px-6 rounded-full transition-all duration-300 transform active:scale-95 font-soft cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
                >
                  Back
                </button>
                <button
                  onClick={() => openShareModal("goals")}
                  className={`text-sm font-medium py-1 px-3 rounded-full transition-all duration-300 transform active:scale-95 font-soft ${
                    !journalData.goals.some((item) => item.trim())
                      ? "bg-pink-100/70 text-text/60 border border-pink-200/50 cursor-not-allowed"
                      : "bg-pink-100 hover:bg-pink-200 text-text cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
                  }`}
                  disabled={!journalData.goals.some((item) => item.trim())}
                >
                  Share to Farcaster
                </button>
              </div>
              <button
                onClick={validateAndContinue}
                className="bg-primary hover:bg-accent text-text font-medium py-2 px-6 rounded-full transition-all duration-300 transform active:scale-95 font-soft cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Affirmations Section */}
        {currentSection === "affirmations" && (
          <div className="animate-slideInRight">
            <h2 className="text-xl font-medium mb-3 text-accent font-soft">
              Daily affirmation
            </h2>
            <div className="space-y-2">
              {journalData.affirmations.map((item, index) => (
                <div key={`affirmation-${index}`} className="relative">
                  <textarea
                    id={`affirmations-${index}`}
                    value={item}
                    onChange={(e) =>
                      handleInputChange("affirmations", index, e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, "affirmations", index)}
                    placeholder={""}
                    className="w-full border border-primary/20 rounded-lg p-3 focus:ring-2 focus:ring-primary/30 focus:border-transparent transition-all duration-300 resize-none text-text grammarly-hide"
                    rows={1}
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                  />
                  {item.trim() && (
                    <button
                      onClick={() => openShareModal("affirmations", index)}
                      className="absolute right-3 top-3 text-xs bg-pink-100 hover:bg-pink-200 text-text p-1.5 rounded-full transition-all duration-300 cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
                      title="Share this affirmation"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.479m-9.566 7.665l9.566 5.479m0 0a2.25 2.25 0 100-4.372m0 4.372V7.686"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="mt-4 flex justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={goBack}
                  className="bg-secondary hover:bg-white text-text font-medium py-2 px-6 rounded-full transition-all duration-300 transform active:scale-95 font-soft cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
                >
                  Back
                </button>
                <button
                  onClick={() => openShareModal("affirmations")}
                  className={`text-sm font-medium py-1 px-3 rounded-full transition-all duration-300 transform active:scale-95 font-soft ${
                    !journalData.affirmations.some((item) => item.trim())
                      ? "bg-pink-100/70 text-text/60 border border-pink-200/50 cursor-not-allowed"
                      : "bg-pink-100 hover:bg-pink-200 text-text cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
                  }`}
                  disabled={
                    !journalData.affirmations.some((item) => item.trim())
                  }
                >
                  Share to Farcaster
                </button>
              </div>
              <button
                onClick={validateAndContinue}
                className="bg-primary hover:bg-accent text-text font-medium py-2 px-6 rounded-full transition-all duration-300 transform active:scale-95 font-soft cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
              >
                Complete
              </button>
            </div>
          </div>
        )}

        {/* Complete Section */}
        {currentSection === "complete" && (
          <div className="animate-slideInRight">
            <h2 className="text-xl font-medium mb-3 text-accent font-soft">
              Your 5-Minute Journal Entry
            </h2>
            <div className="space-y-6">
              {/* Gratitude review */}
              <div className="bg-white/80 p-4 rounded-lg border border-primary/20">
                <h3 className="font-medium text-lg mb-2 text-accent font-soft">
                  I'm grateful for...
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {journalData.gratitude
                    .filter((item) => item.trim())
                    .map((item, index) => (
                      <li
                        key={`gratitude-review-${index}`}
                        className="text-text/90"
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Goals review */}
              <div className="bg-white/80 p-4 rounded-lg border border-primary/20">
                <h3 className="font-medium text-lg mb-2 text-accent font-soft">
                  What would make today great...
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {journalData.goals
                    .filter((item) => item.trim())
                    .map((item, index) => (
                      <li
                        key={`goals-review-${index}`}
                        className="text-text/90"
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Affirmations review */}
              <div className="bg-white/80 p-4 rounded-lg border border-primary/20">
                <h3 className="font-medium text-lg mb-2 text-accent font-soft">
                  Daily affirmations...
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {journalData.affirmations
                    .filter((item) => item.trim())
                    .map((item, index) => (
                      <li
                        key={`affirmations-review-${index}`}
                        className="text-text/90"
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={goBack}
                  className="bg-secondary hover:bg-white text-text font-medium py-2 px-6 rounded-full transition-all duration-300 transform active:scale-95 font-soft cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
                >
                  Edit Entry
                </button>
                <button
                  onClick={startOver}
                  className="bg-primary hover:bg-accent text-text font-medium py-2 px-6 rounded-full transition-all duration-300 transform active:scale-95 font-soft cursor-pointer hover:shadow-md hover:backdrop-blur-sm"
                >
                  Start New Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Farcaster sharing modal - moved outside main content div */}
      <ShareToFarcaster
        isOpen={sharingModalOpen}
        onClose={() => setSharingModalOpen(false)}
        section={shareSection}
        content={shareContent}
      />
    </>
  );
}

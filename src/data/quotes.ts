export interface Quote {
  text: string;
  author: string;
}

// This will be used only if the OpenAI API call fails
const fallbackQuotes: Quote[] = [
  {
    text: "Gratitude turns what we have into enough.",
    author: "Aesop",
  },
];

export async function fetchQuoteFromAI(
  dateSeed?: string
): Promise<Quote | null> {
  try {
    const url = dateSeed
      ? `/api/ai-quote?date=${encodeURIComponent(dateSeed)}`
      : "/api/ai-quote";

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch AI quote");
    }
    const data = await response.json();
    return data.quote;
  } catch (error) {
    console.error("Error fetching AI quote:", error);
    return null;
  }
}

export function getFallbackQuote(seed?: string): Quote {
  if (seed) {
    // Create a simple hash from the seed string
    const hashCode = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };
    // Use the hash to select a quote deterministically for the given date
    const index = hashCode(seed) % fallbackQuotes.length;
    return fallbackQuotes[index];
  }
  // If no seed provided, use random selection
  const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
  return fallbackQuotes[randomIndex];
}

export async function getRandomQuote(dateSeed?: string): Promise<Quote> {
  // Try to get AI quote first, passing along the date seed
  try {
    const aiQuote = await fetchQuoteFromAI(dateSeed);
    if (aiQuote) return aiQuote;
  } catch (error) {
    console.error("Error fetching AI quote:", error);
  }

  // Fall back to local quotes with date seed
  return getFallbackQuote(dateSeed);
}

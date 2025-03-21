export interface Quote {
  text: string;
  author: string;
}

// This will be replaced with AI-generated quotes
const fallbackQuotes: Quote[] = [
  {
    text: "Gratitude turns what we have into enough.",
    author: "Aesop",
  },
  {
    text: "Every moment is a fresh beginning.",
    author: "T.S. Eliot",
  },
  {
    text: "The most wasted of days is one without laughter.",
    author: "E.E. Cummings",
  },
];

export async function fetchQuoteFromAI(): Promise<Quote | null> {
  try {
    const response = await fetch("/api/ai-quote");
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

export function getFallbackQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
  return fallbackQuotes[randomIndex];
}

export async function getRandomQuote(): Promise<Quote> {
  const aiQuote = await fetchQuoteFromAI();
  return aiQuote || getFallbackQuote();
}

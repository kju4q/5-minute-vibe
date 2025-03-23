import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Only one fallback quote in case the API call fails
const fallbackQuotes = [
  {
    text: "Gratitude turns what we have into enough.",
    author: "Aesop",
  },
];

// Cache the generated quotes to reduce API calls
type CachedQuote = {
  quote: { text: string; author: string };
  timestamp: string;
};

let quoteCache: CachedQuote[] = [];
const MAX_CACHE_SIZE = 20;
const CACHE_EXPIRY_HOURS = 24;

function getCachedQuote(): CachedQuote | null {
  // Clear expired quotes from cache (older than CACHE_EXPIRY_HOURS)
  const now = new Date();
  quoteCache = quoteCache.filter((item) => {
    const itemTime = new Date(item.timestamp);
    const hoursDiff = (now.getTime() - itemTime.getTime()) / (1000 * 60 * 60);
    return hoursDiff < CACHE_EXPIRY_HOURS;
  });

  // Return a random quote from cache if available
  if (quoteCache.length > 0) {
    const randomIndex = Math.floor(Math.random() * quoteCache.length);
    return quoteCache[randomIndex];
  }

  return null;
}

async function generateQuoteWithOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            'You are a mindfulness and wellness expert. Create a short, inspiring quote (maximum 120 characters) about gratitude, mindfulness, self-improvement, or positive thinking. The quote should be uplifting and motivational. Don\'t use quotes from famous people. Create an original quote and sign it as \'AI Wisdom\'. Format your response as JSON: {"text": "your quote here", "author": "AI Wisdom"}',
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const quoteData = JSON.parse(content);

    // Cache the quote
    const newCachedQuote = {
      quote: {
        text: quoteData.text,
        author: quoteData.author || "AI Wisdom",
      },
      timestamp: new Date().toISOString(),
    };

    // Add to cache, remove oldest if cache is full
    quoteCache.push(newCachedQuote);
    if (quoteCache.length > MAX_CACHE_SIZE) {
      quoteCache.shift();
    }

    return newCachedQuote;
  } catch (error) {
    console.error("Error generating quote with OpenAI:", error);
    return null;
  }
}

function getFallbackQuote(dateSeed?: string | null) {
  let quote;

  if (dateSeed) {
    // Create a simple hash from the date string
    const hashCode = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

    // Get deterministic quote based on date
    const index = hashCode(dateSeed) % fallbackQuotes.length;
    quote = fallbackQuotes[index];
  } else {
    // Random fallback if no date
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    quote = fallbackQuotes[randomIndex];
  }

  return {
    quote,
    timestamp: dateSeed
      ? `${dateSeed}T12:00:00.000Z`
      : new Date().toISOString(),
  };
}

export async function GET(request: Request) {
  try {
    // Get the date from the request URL query params
    const { searchParams } = new URL(request.url);
    const dateSeed = searchParams.get("date");

    // Use the date as a cache key if provided
    if (dateSeed) {
      // Look for a cached quote with this specific date
      const cachedDateQuote = quoteCache.find(
        (item) => item.timestamp.split("T")[0] === dateSeed
      );

      if (cachedDateQuote) {
        return NextResponse.json(cachedDateQuote);
      }
    } else {
      // If no date provided, check for any cached quote
      const cachedQuote = getCachedQuote();
      if (cachedQuote) {
        return NextResponse.json(cachedQuote);
      }
    }

    // If no cache or specific date quote not found, generate a new quote
    const generatedQuote = await generateQuoteWithOpenAI();
    if (generatedQuote) {
      // If we have a date seed, set the timestamp to that date (at noon)
      if (dateSeed) {
        generatedQuote.timestamp = `${dateSeed}T12:00:00.000Z`;
      }
      return NextResponse.json(generatedQuote);
    }

    // If OpenAI fails, use fallback with date seed if provided
    const fallbackQuote = getFallbackQuote(dateSeed);
    return NextResponse.json(fallbackQuote);
  } catch (error) {
    console.error("Error in quote API:", error);
    // Get date from request even in error case
    try {
      const { searchParams } = new URL(request.url);
      const dateSeed = searchParams.get("date");
      return NextResponse.json(getFallbackQuote(dateSeed));
    } catch {
      return NextResponse.json(getFallbackQuote());
    }
  }
}

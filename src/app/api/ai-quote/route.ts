import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fallback quotes in case the API call fails
const fallbackQuotes = [
  {
    text: "Your journey of self-improvement begins with the simple act of acknowledging your worth each morning.",
    author: "AI Reflection",
  },
  {
    text: "Gratitude doesn't change what you have, it transforms how you experience what you have.",
    author: "AI Wisdom",
  },
  {
    text: "Today's small moments of mindfulness are tomorrow's foundation of peace.",
    author: "AI Insight",
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

function getFallbackQuote() {
  const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
  return {
    quote: fallbackQuotes[randomIndex],
    timestamp: new Date().toISOString(),
  };
}

export async function GET() {
  try {
    // First check if we have a cached quote
    const cachedQuote = getCachedQuote();
    if (cachedQuote) {
      return NextResponse.json(cachedQuote);
    }

    // If no cache, generate a new quote
    const generatedQuote = await generateQuoteWithOpenAI();
    if (generatedQuote) {
      return NextResponse.json(generatedQuote);
    }

    // If OpenAI fails, use fallback
    return NextResponse.json(getFallbackQuote());
  } catch (error) {
    console.error("Error in quote API:", error);
    return NextResponse.json(getFallbackQuote());
  }
}

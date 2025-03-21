import { NextResponse } from "next/server";
import { getRandomQuote } from "../../../data/quotes";

export async function GET() {
  const quote = getRandomQuote();

  return NextResponse.json({
    quote,
    timestamp: new Date().toISOString(),
  });
}

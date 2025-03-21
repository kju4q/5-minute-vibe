import { NextRequest, NextResponse } from "next/server";

// Replace with your actual client ID from Farcaster Developer Dashboard
const CLIENT_ID = process.env.FARCASTER_CLIENT_ID as string;
// Your app's redirect URI
const REDIRECT_URI = process.env.FARCASTER_REDIRECT_URI as string;

export async function GET(request: NextRequest) {
  try {
    // Create a random nonce for this session
    const nonce = Math.random().toString(36).substring(2, 15);

    // Store the nonce in a cookie for validation later
    const response = NextResponse.redirect(
      `https://warpcast.com/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${nonce}`
    );

    // Set an HTTP-only cookie with the nonce
    response.cookies.set("farcaster_auth_state", nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error initiating Farcaster auth:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

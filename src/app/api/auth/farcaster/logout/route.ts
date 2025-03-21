import { NextRequest, NextResponse } from "next/server";

// Your frontend URL
const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    // Create a response that redirects to the home page
    const response = NextResponse.redirect(`${FRONTEND_URL}`);

    // Clear all Farcaster-related cookies
    response.cookies.delete("farcaster_token");
    response.cookies.delete("farcaster_user");
    response.cookies.delete("farcaster_auth_state");

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.redirect(`${FRONTEND_URL}?error=logout_failed`);
  }
}

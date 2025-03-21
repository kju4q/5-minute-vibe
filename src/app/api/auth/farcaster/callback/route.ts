import { NextRequest, NextResponse } from "next/server";

// Replace with your actual credentials from Farcaster Developer Dashboard
const CLIENT_ID = process.env.FARCASTER_CLIENT_ID as string;
const CLIENT_SECRET = process.env.FARCASTER_CLIENT_SECRET as string;
const REDIRECT_URI = process.env.FARCASTER_REDIRECT_URI as string;

// Your frontend URL
const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    // Get the authorization code and state from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // Verify the state matches what we stored in the cookie
    const storedState = request.cookies.get("farcaster_auth_state")?.value;

    if (!code || !state || !storedState || state !== storedState) {
      return NextResponse.redirect(`${FRONTEND_URL}?error=invalid_state`);
    }

    // Exchange the code for an access token
    const tokenResponse = await fetch(
      "https://api.warpcast.com/v2/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
      }
    );

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", await tokenResponse.text());
      return NextResponse.redirect(
        `${FRONTEND_URL}?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Get the user's profile using the access token
    const profileResponse = await fetch("https://api.warpcast.com/v2/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!profileResponse.ok) {
      console.error("Failed to fetch profile:", await profileResponse.text());
      return NextResponse.redirect(
        `${FRONTEND_URL}?error=profile_fetch_failed`
      );
    }

    const profileData = await profileResponse.json();
    const {
      result: { user },
    } = profileData;

    // Create a secure, HttpOnly cookie with the user data and token
    const response = NextResponse.redirect(`${FRONTEND_URL}?login=success`);

    // Store auth token in an HTTP-only cookie
    response.cookies.set("farcaster_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // Store public user data in a regular cookie for the client
    response.cookies.set(
      "farcaster_user",
      JSON.stringify({
        fid: user.fid,
        username: user.username,
        displayName: user.displayName,
        profileImage: user.pfp?.url,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      }
    );

    // Clear the state cookie as it's no longer needed
    response.cookies.delete("farcaster_auth_state");

    return response;
  } catch (error) {
    console.error("Error in Farcaster auth callback:", error);
    return NextResponse.redirect(`${FRONTEND_URL}?error=server_error`);
  }
}

import { NextRequest, NextResponse } from "next/server";

// Replace with your actual credentials from Farcaster Developer Dashboard
const CLIENT_ID = process.env.FARCASTER_CLIENT_ID as string;
const CLIENT_SECRET = process.env.FARCASTER_CLIENT_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    // Get the access token from the cookie
    const accessToken = request.cookies.get("farcaster_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - No access token" },
        { status: 401 }
      );
    }

    // Get the post content from the request body
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Bad request - Text is required" },
        { status: 400 }
      );
    }

    // Post to Farcaster
    const postResponse = await fetch("https://api.warpcast.com/v2/casts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        text,
      }),
    });

    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      console.error("Failed to post to Farcaster:", errorText);

      // Check if token expired
      if (postResponse.status === 401) {
        return NextResponse.json(
          { error: "Unauthorized - Token expired" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: "Failed to post to Farcaster", details: errorText },
        { status: postResponse.status }
      );
    }

    const postData = await postResponse.json();

    return NextResponse.json({
      success: true,
      cast: postData.result.cast,
    });
  } catch (error) {
    console.error("Error posting to Farcaster:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the user data from the cookie
    const userCookie = request.cookies.get("farcaster_user")?.value;

    if (!userCookie) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    try {
      const userData = JSON.parse(userCookie);

      return NextResponse.json({
        authenticated: true,
        user: userData,
      });
    } catch (error) {
      console.error("Error parsing user cookie:", error);

      // If we can't parse the cookie, consider the user not authenticated
      return NextResponse.json(
        { authenticated: false, error: "Invalid user data" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error getting user info:", error);
    return NextResponse.json(
      { authenticated: false, error: "Server error" },
      { status: 500 }
    );
  }
}

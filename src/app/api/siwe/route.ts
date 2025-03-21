import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Simply echo back the message in a SIWE compatible format
    return NextResponse.json({ success: true, message: body }, { status: 200 });
  } catch (error) {
    console.error("SIWE API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process authentication" },
      { status: 500 }
    );
  }
}

// Options API for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

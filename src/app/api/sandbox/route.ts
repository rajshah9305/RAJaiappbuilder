// E2B Sandbox API Route - Currently Disabled
// This feature requires E2B API setup and is optional
// The main app preview works using iframe rendering without E2B

import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { 
      error: "E2B Sandbox feature is currently disabled",
      message: "The main app uses iframe-based preview which works without E2B. This sandbox API is an optional advanced feature.",
      suggestion: "Use the built-in preview tab which renders components directly in the browser."
    },
    { status: 501 }
  );
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { 
      error: "E2B Sandbox feature is currently disabled",
      message: "This is an optional feature. The main app preview works without it."
    },
    { status: 501 }
  );
}

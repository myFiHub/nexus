import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Revalidate the trades cache tag
    revalidateTag("trades");

    return NextResponse.json(
      {
        success: true,
        message: "Trades cache has been revalidated",
        revalidatedTag: "trades",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revalidating trades:", error);
    return NextResponse.json(
      { error: "Failed to revalidate trades cache" },
      { status: 500 }
    );
  }
}

// Also support GET requests for easier testing
export async function GET(request: NextRequest) {
  return POST(request);
}

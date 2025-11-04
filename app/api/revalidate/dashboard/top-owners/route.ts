import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Revalidate the top owners cache tag
    revalidateTag("top-owners", "hours");

    return NextResponse.json(
      {
        success: true,
        message: "Top owners cache has been revalidated",
        revalidatedTag: "top-owners",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revalidating top owners:", error);
    return NextResponse.json(
      { error: "Failed to revalidate top owners cache" },
      { status: 500 }
    );
  }
}

// Also support GET requests for easier testing
export async function GET(request: NextRequest) {
  return POST(request);
}

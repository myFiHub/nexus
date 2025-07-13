import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Revalidate all dashboard-related cache tags
    revalidateTag("recently-joined-users");
    revalidateTag("top-owners");
    revalidateTag("trades");

    return NextResponse.json(
      {
        success: true,
        message: "Dashboard cache has been revalidated",
        revalidatedTags: ["recently-joined-users", "top-owners", "trades"],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revalidating dashboard:", error);
    return NextResponse.json(
      { error: "Failed to revalidate dashboard cache" },
      { status: 500 }
    );
  }
}

// Also support GET requests for easier testing
export async function GET(request: NextRequest) {
  return POST(request);
}

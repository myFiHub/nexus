import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Revalidate the outposts cache tag
    revalidateTag("outposts", "hours");

    return NextResponse.json(
      {
        success: true,
        message: "Outposts cache has been revalidated",
        revalidatedTag: "outposts",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revalidating outposts:", error);
    return NextResponse.json(
      { error: "Failed to revalidate outposts cache" },
      { status: 500 }
    );
  }
}

// Also support GET requests for easier testing
export async function GET(request: NextRequest) {
  return POST(request);
}

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Revalidate the trending outposts cache tag
    revalidateTag("trending-outposts");

    return NextResponse.json(
      {
        success: true,
        message: "Home page trending outposts cache has been revalidated",
        revalidatedTag: "trending-outposts",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revalidating home page:", error);
    return NextResponse.json(
      { error: "Failed to revalidate home page cache" },
      { status: 500 }
    );
  }
}

// Also support GET requests for easier testing
export async function GET(request: NextRequest) {
  return POST(request);
}

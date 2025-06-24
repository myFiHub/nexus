import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Revalidate the all outposts page
    revalidatePath("/all_outposts");

    return NextResponse.json(
      {
        success: true,
        message: "All outposts page has been revalidated",
        revalidatedPath: "/all_outposts",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revalidating all outposts:", error);
    return NextResponse.json(
      { error: "Failed to revalidate all outposts page" },
      { status: 500 }
    );
  }
}

// Also support GET requests for easier testing
export async function GET(request: NextRequest) {
  return POST(request);
}

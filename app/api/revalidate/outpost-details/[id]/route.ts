import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate the ID parameter
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid outpost ID provided" },
        { status: 400 }
      );
    }

    // Revalidate the outpost details page
    revalidatePath(`/outpost_details/${id}`);

    return NextResponse.json(
      {
        success: true,
        message: `Outpost details page for ID ${id} has been revalidated`,
        revalidatedPath: `/outpost_details/${id}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revalidating outpost details:", error);
    return NextResponse.json(
      { error: "Failed to revalidate outpost details page" },
      { status: 500 }
    );
  }
}

// Also support GET requests for easier testing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return POST(request, { params });
}

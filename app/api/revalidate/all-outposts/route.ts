import { revalidateTag } from "next/cache";
import { rejectUntrusted } from "app/lib/server/requestGuards";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const rejected = rejectUntrusted(request);
  if (rejected) return rejected;
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

import { revalidateTag } from "next/cache";
import { rejectUntrusted } from "app/lib/server/requestGuards";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const rejected = rejectUntrusted(request);
  if (rejected) return rejected;
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

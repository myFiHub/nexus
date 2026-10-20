import { revalidateTag } from "next/cache";
import { rejectUntrusted } from "app/lib/server/requestGuards";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const rejected = rejectUntrusted(request);
  if (rejected) return rejected;
  try {
    // Revalidate the trades cache tag
    revalidateTag("trades", "hours");

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

import { revalidateTag } from "next/cache";
import { rejectUntrusted } from "app/lib/server/requestGuards";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const rejected = rejectUntrusted(request);
  if (rejected) return rejected;
  try {
    // Revalidate the home page outposts cache tag
    revalidateTag("home-outposts", "hours");

    return NextResponse.json(
      {
        success: true,
        message: "Home page outposts cache has been revalidated",
        revalidatedTag: "home-outposts",
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

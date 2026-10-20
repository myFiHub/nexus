import { UserTags } from "app/app/(unauthenticated)/users/[filter]/_filters";
import { revalidateTag } from "next/cache";
import { rejectUntrusted } from "app/lib/server/requestGuards";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const rejected = rejectUntrusted(request);
  if (rejected) return rejected;
  try {
    // Revalidate the recently joined users cache tag
    revalidateTag(UserTags.RecentlyJoined, "hours");

    return NextResponse.json(
      {
        success: true,
        message: "Recently joined users cache has been revalidated",
        revalidatedTag: UserTags.RecentlyJoined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revalidating recently joined users:", error);
    return NextResponse.json(
      { error: "Failed to revalidate recently joined users cache" },
      { status: 500 }
    );
  }
}

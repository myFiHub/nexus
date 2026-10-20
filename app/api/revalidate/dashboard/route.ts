import {
  TradesTags,
  UserTags,
} from "app/app/(unauthenticated)/users/[filter]/_filters";
import { revalidateTag } from "next/cache";
import { rejectUntrusted } from "app/lib/server/requestGuards";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const rejected = rejectUntrusted(request);
  if (rejected) return rejected;
  try {
    // Revalidate all dashboard-related cache tags
    revalidateTag(UserTags.RecentlyJoined, "hours");
    revalidateTag(UserTags.TopOwners, "hours");
    revalidateTag(TradesTags.Trades, "hours");

    return NextResponse.json(
      {
        success: true,
        message: "Dashboard cache has been revalidated",
        revalidatedTags: [
          UserTags.RecentlyJoined,
          UserTags.TopOwners,
          TradesTags.Trades,
        ],
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

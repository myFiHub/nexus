import { AppPages } from "app/lib/routes";
import { revalidatePath, revalidateTag } from "next/cache";
import { isUuid, rejectUntrusted } from "app/lib/server/requestGuards";
import { NextRequest, NextResponse } from "next/server";

interface RevalidateOptions {
  cacheOnly?: boolean;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rejected = rejectUntrusted(request);
  if (rejected) return rejected;
  try {
    const { id } = await params;

    // Validate the ID parameter
    if (!id || typeof id !== "string" || !isUuid(id)) {
      return NextResponse.json(
        { error: "Invalid outpost ID provided" },
        { status: 400 }
      );
    }

    // Parse request body to check for options
    let options: RevalidateOptions = {};
    try {
      const body = await request.json();
      if (body && typeof body?.cacheOnly === "boolean") {
        options = { cacheOnly: body.cacheOnly };
      }
    } catch {
      // If no body or invalid JSON, use default options
    }

    // Always revalidate the outpost details cache tag
    revalidateTag(`outpost-details-${id}`, "hours");

    // Only revalidate path if not cache-only
    if (!options.cacheOnly) {
      revalidatePath(AppPages.outpostDetails(id));
    }

    return NextResponse.json(
      {
        success: true,
        message: options.cacheOnly
          ? `Outpost details cache for ID ${id} has been revalidated`
          : `Outpost details page and cache for ID ${id} has been revalidated`,
        revalidatedPath: options.cacheOnly
          ? undefined
          : AppPages.outpostDetails(id),
        revalidatedTags: [`outpost-details-${id}`],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revalidating outpost details:", error);
    return NextResponse.json(
      { error: "Failed to revalidate outpost details page and cache" },
      { status: 500 }
    );
  }
}

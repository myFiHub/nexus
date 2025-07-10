import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface RevalidateOptions {
  all?: boolean;
  userData?: boolean;
  passBuyers?: boolean;
  followers?: boolean;
  followings?: boolean;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate the ID parameter
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid user ID provided" },
        { status: 400 }
      );
    }

    // Parse request body to check for specific revalidation options
    let options: RevalidateOptions = { all: false };
    try {
      const body = await request.json();
      if (body && typeof body === "object") {
        options = { ...options, ...body };
      }
    } catch {
      // If no body or invalid JSON, use default options (no revalidation)
    }

    // Always revalidate the user page (path-based)
    revalidatePath(`/user/${id}`);

    // Only revalidate cache tags if explicitly requested
    if (options.all) {
      // Revalidate all user-related cache tags
      revalidateTag(`user-data-${id}`);
      revalidateTag(`user-pass-buyers-${id}`);
      revalidateTag(`user-followers-${id}`);
      revalidateTag(`user-followings-${id}`);
    } else {
      // Revalidate specific cache tags based on options
      if (options.userData) {
        revalidateTag(`user-data-${id}`);
      }
      if (options.passBuyers) {
        revalidateTag(`user-pass-buyers-${id}`);
      }
      if (options.followers) {
        revalidateTag(`user-followers-${id}`);
      }
      if (options.followings) {
        revalidateTag(`user-followings-${id}`);
      }
    }

    // Build list of revalidated tags for response
    const revalidatedTags = [];
    if (options.all) {
      revalidatedTags.push(
        `user-data-${id}`,
        `user-pass-buyers-${id}`,
        `user-followers-${id}`,
        `user-followings-${id}`
      );
    } else {
      if (options.userData) revalidatedTags.push(`user-data-${id}`);
      if (options.passBuyers) revalidatedTags.push(`user-pass-buyers-${id}`);
      if (options.followers) revalidatedTags.push(`user-followers-${id}`);
      if (options.followings) revalidatedTags.push(`user-followings-${id}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: `User page for ID ${id} has been revalidated${
          revalidatedTags.length > 0 ? " with cache tags" : ""
        }`,
        revalidatedPath: `/user/${id}`,
        revalidatedTags,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revalidating user:", error);
    return NextResponse.json(
      { error: "Failed to revalidate user page and cache" },
      { status: 500 }
    );
  }
}

// Also support GET requests for easier testing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return POST(request, { params });
}

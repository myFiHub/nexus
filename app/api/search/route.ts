import podiumApi from "app/services/api";
import { OutpostModel, User } from "app/services/api/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "all"; // 'outposts', 'users', or 'all'
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Search query is required",
        },
        { status: 400 }
      );
    }

    const normalizedQuery = query.toLowerCase().trim();

    // Initialize results
    let outposts: OutpostModel[] = [];
    let users: User[] = [];
    let totalResults = 0;

    // Search outposts
    if (type === "outposts" || type === "all") {
      try {
        const allOutposts = await podiumApi.getOutposts(0, 500); // Get more for better search

        if (!(allOutposts instanceof Error)) {
          outposts = allOutposts.filter((outpost: OutpostModel) => {
            const searchableText = [
              outpost.name,
              outpost.subject,
              outpost.creator_user_name,
              ...(outpost.tags || []),
            ]
              .join(" ")
              .toLowerCase();

            return searchableText.includes(normalizedQuery);
          });

          // Sort by relevance (name matches first, then subject, then other fields)
          outposts.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const aSubject = a.subject?.toLowerCase() || "";
            const bSubject = b.subject?.toLowerCase() || "";

            // Exact matches first
            if (aName === normalizedQuery) return -1;
            if (bName === normalizedQuery) return 1;

            // Name starts with query
            if (
              aName.startsWith(normalizedQuery) &&
              !bName.startsWith(normalizedQuery)
            )
              return -1;
            if (
              bName.startsWith(normalizedQuery) &&
              !aName.startsWith(normalizedQuery)
            )
              return 1;

            // Name contains query
            if (
              aName.includes(normalizedQuery) &&
              !bName.includes(normalizedQuery)
            )
              return -1;
            if (
              bName.includes(normalizedQuery) &&
              !aName.includes(normalizedQuery)
            )
              return 1;

            // Subject contains query
            if (
              aSubject.includes(normalizedQuery) &&
              !bSubject.includes(normalizedQuery)
            )
              return -1;
            if (
              bSubject.includes(normalizedQuery) &&
              !aSubject.includes(normalizedQuery)
            )
              return 1;

            // Sort by member count (popularity)
            return (b.members_count || 0) - (a.members_count || 0);
          });

          // Apply pagination
          outposts = outposts.slice(offset, offset + limit);
        }
      } catch (error) {
        console.error("Error searching outposts:", error);
      }
    }

    // Search users (if we have access to user search API)
    if (type === "users" || type === "all") {
      // Note: This would require a user search API endpoint
      // For now, we'll search through creators from outposts
      try {
        const allOutposts = await podiumApi.getOutposts(0, 500);

        if (!(allOutposts instanceof Error)) {
          const creatorMap = new Map<string, any>();

          allOutposts.forEach((outpost: OutpostModel) => {
            if (
              outpost.creator_user_name.toLowerCase().includes(normalizedQuery)
            ) {
              creatorMap.set(outpost.creator_user_uuid, {
                uuid: outpost.creator_user_uuid,
                name: outpost.creator_user_name,
                image: outpost.creator_user_image,
                outpost_count:
                  (creatorMap.get(outpost.creator_user_uuid)?.outpost_count ||
                    0) + 1,
              });
            }
          });

          users = Array.from(creatorMap.values())
            .sort((a, b) => b.outpost_count - a.outpost_count)
            .slice(offset, offset + limit);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }

    totalResults = outposts.length + users.length;

    // Generate search suggestions
    const suggestions = generateSearchSuggestions(query, outposts, users);

    const response = {
      query,
      type,
      results: {
        outposts,
        users,
        total: totalResults,
      },
      suggestions,
      pagination: {
        limit,
        offset,
        hasMore: totalResults >= limit,
      },
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300", // Cache for 5 minutes
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Generate search suggestions based on results
function generateSearchSuggestions(
  query: string,
  outposts: OutpostModel[],
  users: any[]
): string[] {
  const suggestions = new Set<string>();

  // Add popular tags from matching outposts
  outposts.forEach((outpost) => {
    if (outpost.tags) {
      outpost.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(tag);
        }
      });
    }
  });

  // Add creator names from matching outposts
  outposts.forEach((outpost) => {
    if (outpost.creator_user_name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(outpost.creator_user_name);
    }
  });

  // Add user names
  users.forEach((user) => {
    if (user.name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(user.name);
    }
  });

  return Array.from(suggestions).slice(0, 5);
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

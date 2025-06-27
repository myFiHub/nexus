import { NextRequest, NextResponse } from "next/server";

const LUMA_BASE_URL = "https://api.lu.ma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, "GET", resolvedParams.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, "POST", resolvedParams.path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, "PUT", resolvedParams.path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, "DELETE", resolvedParams.path);
}

async function handleRequest(
  request: NextRequest,
  method: string,
  pathSegments: string[]
) {
  try {
    // Reconstruct the path from segments
    const path = "/" + pathSegments.join("/");

    // Get query parameters
    const url = new URL(request.url);
    const queryString = url.search;

    // Construct the target URL
    const targetUrl = `${LUMA_BASE_URL}${path}${queryString}`;

    console.log(`Proxying ${method} request to: ${targetUrl}`);

    // Prepare headers
    const headers = new Headers();

    // Copy relevant headers from the original request
    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers.set("content-type", contentType);
    }

    // Add Luma API key from environment variable
    const apiKey = process.env.NEXT_PUBLIC_LUMA_API_KEY;
    if (!apiKey) {
      console.error("Luma API key not found in environment variables");
      return NextResponse.json(
        { error: "Luma API key not configured" },
        { status: 500 }
      );
    }
    headers.set("x-luma-api-key", apiKey);

    // Prepare the request body for POST/PUT requests
    let body: string | undefined;
    if (method === "POST" || method === "PUT") {
      try {
        const requestBody = await request.json();
        body = JSON.stringify(requestBody);
        console.log("Request body:", requestBody);
      } catch (error) {
        // If JSON parsing fails, try to get as text
        body = await request.text();
        console.log("Request body (text):", body);
      }
    }

    // Make the request to Luma API
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    console.log(`Luma API response status: ${response.status}`);

    // Get the response data
    const responseData = await response.text();

    // Try to parse as JSON, fallback to text
    let parsedData;
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }

    // Return the response with the same status code
    return NextResponse.json(parsedData, {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Luma proxy error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

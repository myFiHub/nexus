# Revalidation Service

This service provides client-side methods to call the revalidation API endpoints for refreshing cached pages in the Nexus application.

## Features

- Revalidate user profile pages
- Revalidate outpost details pages
- Revalidate all outposts listing page
- Batch revalidation of multiple pages
- React hook for easy integration
- Error handling and loading states
- **Automatic base URL detection** from current location

## Base URL Configuration

The revalidation service automatically detects the current URL and uses it as the base URL for API calls:

### Automatic Detection (Default)

The service automatically detects the current domain and protocol:

```typescript
import { revalidateService } from "@/services/revalidate";

// Automatically uses current URL (e.g., https://yourdomain.com)
await revalidateService.revalidateOutpostDetails("outpost123");
```

**Examples of auto-detected URLs:**

- `https://yourdomain.com` → `https://yourdomain.com/api/revalidate/outpost-details/123`
- `http://localhost:3000` → `http://localhost:3000/api/revalidate/outpost-details/123`
- `https://staging.yourapp.com` → `https://staging.yourapp.com/api/revalidate/outpost-details/123`

### Custom Base URL

For cross-domain calls or when you need to override the auto-detection:

```typescript
import { createRevalidateService } from "@/services/revalidate";

// Create service with custom base URL
const externalRevalidateService = createRevalidateService(
  "https://yourdomain.com"
);

// Uses absolute URLs like https://yourdomain.com/api/revalidate/outpost-details/123
await externalRevalidateService.revalidateOutpostDetails("outpost123");
```

## Usage

### Direct Service Usage

```typescript
import { revalidateService } from "@/services/revalidate";

// Revalidate a user profile page
try {
  const result = await revalidateService.revalidateUser("user123");
  console.log("User page revalidated:", result.message);
} catch (error) {
  console.error("Failed to revalidate user:", error);
}

// Revalidate an outpost details page
try {
  const result = await revalidateService.revalidateOutpostDetails("outpost456");
  console.log("Outpost page revalidated:", result.message);
} catch (error) {
  console.error("Failed to revalidate outpost:", error);
}

// Revalidate all outposts page
try {
  const result = await revalidateService.revalidateAllOutposts();
  console.log("All outposts page revalidated:", result.message);
} catch (error) {
  console.error("Failed to revalidate all outposts:", error);
}

// Revalidate multiple pages at once
try {
  const results = await revalidateService.revalidateMultiple({
    userId: "user123",
    outpostId: "outpost456",
    allOutposts: true,
  });
  console.log("Multiple pages revalidated:", results.length);
} catch (error) {
  console.error("Failed to revalidate pages:", error);
}
```

### React Hook Usage

```typescript
import { useRevalidate } from "@/services/revalidate/useRevalidate";

function MyComponent() {
  const {
    revalidateUser,
    revalidateOutpostDetails,
    revalidateAllOutposts,
    revalidateMultiple,
    isLoading,
    error,
    clearError,
  } = useRevalidate();

  const handleUserUpdate = async (userId: string) => {
    try {
      await revalidateUser(userId);
      // Show success message
    } catch (error) {
      // Error is automatically set in the hook
    }
  };

  const handleOutpostUpdate = async (outpostId: string) => {
    try {
      // Revalidate both the outpost details and all outposts listing
      await revalidateMultiple({
        outpostId,
        allOutposts: true,
      });
      // Show success message
    } catch (error) {
      // Error is automatically set in the hook
    }
  };

  return (
    <div>
      {isLoading && <div>Revalidating...</div>}
      {error && (
        <div>
          Error: {error}
          <button onClick={clearError}>Clear</button>
        </div>
      )}

      <button onClick={() => handleUserUpdate("user123")} disabled={isLoading}>
        Refresh User Page
      </button>

      <button
        onClick={() => handleOutpostUpdate("outpost456")}
        disabled={isLoading}
      >
        Refresh Outpost Pages
      </button>
    </div>
  );
}
```

## API Reference

### RevalidateService

#### `constructor(baseUrl?: string)`

Creates a new RevalidateService instance.

- `baseUrl` (optional): Base URL for API calls. If not provided, auto-detects from `window.location.origin`.

#### `revalidateUser(userId: string): Promise<RevalidateResponse>`

Revalidates a user profile page.

#### `revalidateOutpostDetails(outpostId: string): Promise<RevalidateResponse>`

Revalidates an outpost details page.

#### `revalidateAllOutposts(): Promise<RevalidateResponse>`

Revalidates the all outposts listing page.

#### `revalidateMultiple(options): Promise<RevalidateResponse[]>`

Revalidates multiple pages based on the provided options.

### useRevalidate Hook

Returns an object with:

- `revalidateUser(userId)`: Function to revalidate user page
- `revalidateOutpostDetails(outpostId)`: Function to revalidate outpost page
- `revalidateAllOutposts()`: Function to revalidate all outposts page
- `revalidateMultiple(options)`: Function to revalidate multiple pages
- `isLoading`: Boolean indicating if a request is in progress
- `error`: String containing the last error message (if any)
- `clearError()`: Function to clear the error state

## Response Format

All revalidation methods return a `RevalidateResponse` object:

```typescript
interface RevalidateResponse {
  success: boolean;
  message: string;
  revalidatedPath: string;
}
```

## Error Handling

The service throws errors for:

- Invalid parameters (missing IDs)
- Network errors
- Server errors (4xx, 5xx responses)

The React hook automatically manages error state and provides a `clearError()` function to reset the error state.

## Environment Support

- **Client-side**: Automatically detects current URL using `window.location.origin`
- **Server-side**: Falls back to relative URLs (empty base URL) for SSR compatibility

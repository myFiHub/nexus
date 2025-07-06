# Revalidation Service

This service provides client-side methods to call the revalidation API endpoints for refreshing cached pages and cache tags in the Nexus application.

## Features

- Revalidate user profile pages (path-based)
- **NEW**: Revalidate user data cache tags (granular control)
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

#### User Profile Revalidation

```typescript
import { revalidateService } from "@/services/revalidate";

// Revalidate user profile page (path only)
try {
  const result = await revalidateService.revalidateUser("user123");
  console.log("User page revalidated:", result.message);
} catch (error) {
  console.error("Failed to revalidate user:", error);
}

// Revalidate specific user data cache tags
try {
  const result = await revalidateService.revalidateUserData("user123", {
    userData: true,
    followers: true,
  });
  console.log("User data revalidated:", result.message);
  console.log("Revalidated tags:", result.revalidatedTags);
} catch (error) {
  console.error("Failed to revalidate user data:", error);
}

// Convenience methods for specific data types
await revalidateService.revalidateUserBasicData("user123");
await revalidateService.revalidateUserFollowers("user123");
await revalidateService.revalidateUserFollowings("user123");
await revalidateService.revalidateUserPassBuyers("user123");
await revalidateService.revalidateAllUserData("user123"); // all: true
```

#### Outpost Revalidation

```typescript
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
```

#### Batch Revalidation

```typescript
// Revalidate multiple pages at once
try {
  const results = await revalidateService.revalidateMultiple({
    userId: "user123",
    outpostId: "outpost456",
    allOutposts: true,
    userDataOptions: {
      followers: true,
      followings: true,
    },
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
    revalidateUserData,
    revalidateUserFollowers,
    revalidateOutpostDetails,
    revalidateAllOutposts,
    revalidateMultiple,
    isLoading,
    error,
    clearError,
  } = useRevalidate();

  const handleUserFollow = async (userId: string) => {
    try {
      // Only revalidate followers when someone follows/unfollows
      await revalidateUserFollowers(userId);
      // Show success message
    } catch (error) {
      // Error is automatically set in the hook
    }
  };

  const handleUserProfileUpdate = async (userId: string) => {
    try {
      // Only revalidate basic user data when profile is updated
      await revalidateUserData(userId, { userData: true });
      // Show success message
    } catch (error) {
      // Error is automatically set in the hook
    }
  };

  const handleComplexUserUpdate = async (userId: string) => {
    try {
      // Revalidate multiple specific data types
      await revalidateUserData(userId, {
        userData: true,
        followers: true,
        followings: true,
      });
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

      <button onClick={() => handleUserFollow("user123")} disabled={isLoading}>
        Follow User (Revalidate Followers)
      </button>

      <button
        onClick={() => handleUserProfileUpdate("user123")}
        disabled={isLoading}
      >
        Update Profile (Revalidate User Data)
      </button>

      <button
        onClick={() => handleComplexUserUpdate("user123")}
        disabled={isLoading}
      >
        Complex Update (Multiple Cache Tags)
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

#### User Revalidation Methods

##### `revalidateUser(userId: string): Promise<RevalidateResponse>`

Revalidates a user profile page (path-based revalidation only).

##### `revalidateUserData(userId: string, options?: UserDataRevalidateOptions): Promise<RevalidateResponse>`

Revalidates user data with granular cache tag control.

**Options:**

- `userData?: boolean` - Revalidate basic user information
- `passBuyers?: boolean` - Revalidate pass buyers data
- `followers?: boolean` - Revalidate followers data
- `followings?: boolean` - Revalidate followings data
- `all?: boolean` - Revalidate all user data (default: false)

##### Convenience Methods

- `revalidateUserBasicData(userId)` - Only basic user data
- `revalidateUserFollowers(userId)` - Only followers
- `revalidateUserFollowings(userId)` - Only followings
- `revalidateUserPassBuyers(userId)` - Only pass buyers
- `revalidateAllUserData(userId)` - All user data

#### Other Methods

##### `revalidateOutpostDetails(outpostId: string): Promise<RevalidateResponse>`

Revalidates an outpost details page.

##### `revalidateAllOutposts(): Promise<RevalidateResponse>`

Revalidates the all outposts listing page.

##### `revalidateMultiple(options): Promise<RevalidateResponse[]>`

Revalidates multiple pages based on the provided options.

**Options:**

- `userId?: string` - User ID to revalidate
- `outpostId?: string` - Outpost ID to revalidate
- `allOutposts?: boolean` - Whether to revalidate all outposts page
- `userDataOptions?: UserDataRevalidateOptions` - Cache tag options for user data

### useRevalidate Hook

Returns an object with all the service methods plus:

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
  revalidatedTags?: string[]; // NEW: Array of cache tags that were revalidated
}
```

## Cache Tags

The following cache tags are used for user data:

- `user-data-${userId}` - Basic user information
- `user-pass-buyers-${userId}` - User's pass buyers
- `user-followers-${userId}` - User's followers
- `user-followings-${userId}` - User's followings

## Error Handling

The service throws errors for:

- Invalid parameters (missing IDs)
- Network errors
- Server errors (4xx, 5xx responses)

The React hook automatically manages error state and provides a `clearError()` function to reset the error state.

## Environment Support

- **Client-side**: Automatically detects current URL using `window.location.origin`
- **Server-side**: Falls back to relative URLs (empty base URL) for SSR compatibility

## Performance Best Practices

1. **Be Specific**: Only revalidate the cache tags you need
2. **Default Behavior**: By default, cache tags are NOT revalidated (`all: false`)
3. **Batch Operations**: Use `revalidateMultiple` for related operations
4. **Targeted Updates**: Use convenience methods for single data types

### Examples of Efficient Usage

```typescript
// ✅ Good: Only revalidate what changed
await revalidateService.revalidateUserFollowers("user123"); // After follow/unfollow
await revalidateService.revalidateUserData("user123", { userData: true }); // After profile update

// ❌ Bad: Revalidates everything unnecessarily
await revalidateService.revalidateAllUserData("user123"); // For a simple follow action
```

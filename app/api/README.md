# Revalidation API Endpoints

This directory contains API endpoints that can be called by external applications to revalidate specific pages in the Nexus application.

## Endpoints

### 1. Revalidate User Page

**Endpoint:** `POST /api/revalidate/user/[id]` or `GET /api/revalidate/user/[id]`

**Description:** Revalidates the user profile page for a specific user ID.

**Parameters:**

- `id` (path parameter): The user ID to revalidate

**Example Usage:**

```bash
# Using curl
curl -X POST http://your-domain.com/api/revalidate/user/12345

# Using fetch
fetch('/api/revalidate/user/12345', {
  method: 'POST'
})
```

**Response:**

```json
{
  "success": true,
  "message": "User page for ID 12345 has been revalidated",
  "revalidatedPath": "/user/12345"
}
```

### 2. Revalidate All Outposts Page

**Endpoint:** `POST /api/revalidate/all-outposts` or `GET /api/revalidate/all-outposts`

**Description:** Revalidates the all outposts listing page.

**Example Usage:**

```bash
# Using curl
curl -X POST http://your-domain.com/api/revalidate/all-outposts

# Using fetch
fetch('/api/revalidate/all-outposts', {
  method: 'POST'
})
```

**Response:**

```json
{
  "success": true,
  "message": "All outposts page has been revalidated",
  "revalidatedPath": "/all_outposts"
}
```

### 3. Revalidate Outpost Details Page

**Endpoint:** `POST /api/revalidate/outpost-details/[id]` or `GET /api/revalidate/outpost-details/[id]`

**Description:** Revalidates the outpost details page for a specific outpost ID.

**Parameters:**

- `id` (path parameter): The outpost ID to revalidate

**Example Usage:**

```bash
# Using curl
curl -X POST http://your-domain.com/api/revalidate/outpost-details/67890

# Using fetch
fetch('/api/revalidate/outpost-details/67890', {
  method: 'POST'
})
```

**Response:**

```json
{
  "success": true,
  "message": "Outpost details page for ID 67890 has been revalidated",
  "revalidatedPath": "/outpost_details/67890"
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200`: Success
- `400`: Bad Request (invalid parameters)
- `500`: Internal Server Error

## Security Considerations

These endpoints are currently open and can be called by any external application. Consider implementing authentication if needed for production use.

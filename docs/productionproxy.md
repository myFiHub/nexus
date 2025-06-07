# Production Proxy Architecture for Podium Nexus

## Overview
A **production proxy** is an intermediary server that forwards API requests from your frontend to a third-party backend (such as a blockchain RPC or indexer). In Podium Nexus, this is essential for securely and reliably connecting the frontend to the Movement Network RPC and other external APIs, especially when those services do not support CORS (Cross-Origin Resource Sharing) for browser clients.

---

## Why is a Production Proxy Needed?

### 1. **CORS Restrictions**
- Most blockchain RPC endpoints (including Movement Network) do **not** set permissive CORS headers.
- Browsers block direct requests from frontend code to these endpoints for security reasons.
- Without a proxy, your app will fail to fetch on-chain data in production.

### 2. **Security & Control**
- A proxy allows you to:
  - Add authentication, rate limiting, and logging.
  - Filter or rewrite requests for security or analytics.
  - Hide sensitive API keys or endpoints from the client.

### 3. **Performance & Reliability**
- Proxies can cache responses, reducing load and latency.
- They can provide fallback or error handling for upstream outages.

---

## How the Production Proxy Works

### High-Level Flow
```mermaid
graph LR
    A[User Browser] --> B[Your Domain (Nginx Proxy)]
    B --> C[Movement Network RPC]
    C --> B
    B --> A
```

### Request Example
- **Frontend:** `fetch('/v1/accounts/0x123...')`
- **Nginx Proxy:** Forwards to `https://mainnet.movementnetwork.xyz/v1/accounts/0x123...`
- **Response:** Nginx adds CORS headers and returns data to the browser.

### Example Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /v1/ {
        proxy_pass https://mainnet.movementnetwork.xyz/v1/;
        proxy_set_header Host mainnet.movementnetwork.xyz;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' '*';

        # Optional: Rate limiting, caching, logging, security headers
    }

    location / {
        root /var/www/podium-nexus;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Implementation Steps
1. **Frontend:**
   - All Movement RPC calls use `/v1/...` as the base path.
   - No direct calls to the third-party domain from the browser.
2. **Dev Environment:**
   - Vite dev server proxies `/v1` to the real endpoint (see `vite.config.mts`).
3. **Production:**
   - Nginx (or similar) proxies `/v1` to the Movement RPC.
   - CORS and security headers are set at the proxy layer.

---

## Pros and Cons

### Pros
- **Bypasses CORS issues** for all users.
- **Centralized control** over API traffic (rate limiting, logging, security).
- **Can add caching** for performance.
- **Hides backend details** from the client.
- **Easier to swap endpoints** or add fallback logic.

### Cons
- **Adds infrastructure complexity** (must maintain proxy config).
- **Potential single point of failure** if proxy goes down.
- **Slight latency increase** (one extra network hop).
- **Must keep proxy secure** (avoid open relays, abuse, etc).

---

## When Not to Use a Proxy
- If the third-party API **already supports CORS** and is safe to call directly from the browser.
- For purely static content or public assets.

---

## Summary
A production proxy is **required** for Podium Nexus to interact with Movement Network and similar services from the browser. It solves CORS issues, adds security and control, and enables a robust, production-ready architecture. All frontend code should use the proxied path (e.g., `/v1`) for external API calls.

---

**See also:**
- `vite.config.mts` for dev proxy setup
- [MDN: Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Nginx Proxy Documentation](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) 
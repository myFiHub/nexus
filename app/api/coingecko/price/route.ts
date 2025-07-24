import { NextResponse } from "next/server";

let cachedPrice: number | null = null;
let lastFetched = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds

async function fetchAndCachePrice() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=movement&vs_currencies=usd"
    );
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    const price = Number(data?.movement?.usd);
    if (!isNaN(price)) {
      cachedPrice = price;
      lastFetched = Date.now();
    }
  } catch (e) {
    // Optionally log error
  }
}

// Set up interval to refresh price every 30 seconds
if (typeof global !== "undefined" && !(global as any)._movePriceInterval) {
  (global as any)._movePriceInterval = setInterval(
    fetchAndCachePrice,
    CACHE_DURATION
  );
  fetchAndCachePrice(); // Initial fetch
}

export async function GET() {
  // Optionally, trigger a fetch if cache is stale (for robustness)
  if (!cachedPrice || Date.now() - lastFetched > CACHE_DURATION) {
    await fetchAndCachePrice();
  }
  if (cachedPrice !== null) {
    return NextResponse.json({ movement: { usd: cachedPrice } });
  } else {
    return NextResponse.json({ error: "Price unavailable" }, { status: 500 });
  }
}

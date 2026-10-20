import { NextResponse } from "next/server";

const PRICE_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=movement&vs_currencies=usd";

export async function GET() {
  try {
    const res = await fetch(PRICE_URL, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);
    const data = await res.json();
    const price = Number(data?.movement?.usd);
    if (!Number.isFinite(price)) throw new Error("Malformed price");
    return NextResponse.json(
      { movement: { usd: price } },
      { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json({ error: "Price unavailable" }, { status: 502 });
  }
}

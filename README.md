# Podium Nexus

The web app for [Podium](https://podiumnexus.com): discover, schedule and join **outposts** (live audio spaces), follow creators, trade Passes and track how your outposts perform.

Built with Next.js 16 (App Router, Turbopack), React 19, Redux Toolkit + redux-saga, Tailwind CSS v4, Web3Auth and the Movement (Aptos) chain. It talks to the same Podium backend as the mobile app.

---

## Contents

- [Quick start](#quick-start)
- [Running against production](#running-against-production)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project layout](#project-layout)
- [How it works](#how-it-works)
- [Design system (Aurora)](#design-system-aurora)
- [Security model](#security-model)
- [Conventions](#conventions)
- [Troubleshooting](#troubleshooting)

---

## Quick start

Requirements: **Node 22+** and **Yarn 1.x** (the repo ships a `yarn.lock`; don't mix in npm).

```sh
git clone https://github.com/myFiHub/nexus.git
cd nexus
yarn install            # also applies patches/ via patch-package
cp env.production.template .env.local
# fill in .env.local (see below)
yarn dev                # http://localhost:3000
```

`yarn dev` runs in development mode, which uses the **Web3Auth Sapphire devnet** network. Pair it with a development backend and a devnet Web3Auth client ID.

---

## Running against production

To test locally against the live Podium backend, run a production build. Production mode switches Web3Auth to **Sapphire mainnet**, so you sign in with the same wallet and account as on the live site.

1. Put production values in `.env.production.local`. It overrides `.env.production` and is only read by `next build` / `next start`.
   The values that differ between environments are:
   - `NEXT_PUBLIC_PODIUM_API_URL` (backend base URL, including `/api/v1`)
   - `NEXT_PUBLIC_WEBSOCKET_ADDRESS`
   - `NEXT_PUBLIC_ONESIGNAL_APP_ID`
   - `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID`

   The mobile app's `podium/env/production.env` (`PODIM_BACKEND_BASE_URL`, `WEBSOCKET_ADDRESS`, `ONESIGNAL_API_KEY`, `WEB3_AUTH_CLIENT_ID`) is the source of truth.
2. Build and serve:

   ```sh
   yarn preview            # next build && next start → http://localhost:3000
   ```

> **You are using real data.** Anything you create, follow, cheer or buy locally happens on production.

Notes:

- Rebuild after changing env values. `NEXT_PUBLIC_*` values are inlined at build time.
- If pages show stale or empty data after switching backends, clear Next's data cache with `rm -rf .next/cache/fetch-cache` and rebuild.
- OneSignal push only works on the domain configured in OneSignal, so expect it to be inactive on `localhost`.

---

## Environment variables

Copy `env.production.template` and fill it in. Env files are git-ignored. Never commit them.

| Variable | Exposed to browser | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_PODIUM_API_URL` | yes | Podium REST API base URL |
| `NEXT_PUBLIC_WEBSOCKET_ADDRESS` | yes | Real-time server for live outposts |
| `NEXT_PUBLIC_OUTPOST_SERVER` | yes | Audio (Jitsi) server domain |
| `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` | yes | Web3Auth project (devnet in dev, mainnet in prod builds) |
| `NEXT_PUBLIC_MOVEMENT_RPC_URL` | yes | Movement / Aptos RPC |
| `NEXT_PUBLIC_PODIUM_PROTOCOL_ADDRESS`, `NEXT_PUBLIC_CHEER_BOO_ADDRESS`, `NEXT_PUBLIC_FIHUB_ADDRESS`, `NEXT_PUBLIC_FIHUB_ADDRESS_APTOS` | yes | On-chain contract addresses |
| `NEXT_PUBLIC_FIREBASE_*` | yes | Firebase (storage for uploads) |
| `NEXT_PUBLIC_ONESIGNAL_APP_ID` | yes | Web push |
| `NEXT_PUBLIC_WEBSITE_LINK_URL` | yes | Canonical site URL (metadata, share links) |
| `LUMA_API_KEY` | **no** | Luma events API. Only read on the server. |
| `REVALIDATE_SECRET` | **no** | Optional. Lets backend jobs call `/api/revalidate/*`. |

`NEXT_PUBLIC_LUMA_API_KEY` is still read as a fallback, but please migrate to `LUMA_API_KEY`.

---

## Scripts

| Command | What it does |
| --- | --- |
| `yarn dev` | Dev server with Turbopack |
| `yarn build` | Production build |
| `yarn start` | Serve the last build |
| `yarn preview` | `build` + `start` in one go |
| `yarn lint` | ESLint (flat config, React Compiler rules). Should stay at **0 errors**. |
| `yarn tsc --noEmit` | Type-check |

`postinstall` runs `patch-package`. If you reinstall or remove packages with a command that skips lifecycle scripts, run `npx patch-package` yourself, or the Jitsi SDK types break.

---

## Project layout

```text
app/                      Routes (App Router)
  (unauthenticated)/      Public pages: home feed, all_outposts, outpost_details/[id], user/[id], tags/[id], search, users, dashboard…
  (authenticated)/        Signed-in pages: profile, create_outpost, my_outposts, ongoing_outpost/[id], analytics
  api/                    Route handlers: revalidate/*, cookies, luma proxy, luma-access, coingecko price
  error.tsx, global-error.tsx, not-found.tsx
components/               Shared UI (Aurora primitives in components/aurora, dialogs, header, sidebar)
containers/<feature>/     Feature modules: slice.ts, saga.ts, selectors.ts, components
services/api/             Podium API client (axios) and Luma client/server helpers
services/wsClient/        WebSocket client for live outposts
services/move/            Movement / Aptos transactions
store/                    Redux store with runtime reducer/saga injection
lib/                      Utilities: clock, theme, cookies, referral, bans, server request guards…
hooks/                    Small client hooks (useIsMobile, useHydrated)
patches/                  patch-package patches for third-party libs
```

---

## How it works

**Rendering.** Public pages are server components. They fetch through `unstable_cache` with tags, so they're fast and cache-friendly. These cached pages carry no viewer context. Anything viewer-specific (am I following, am I banned, mutual followers) is fetched client-side after hydration.

**State.** One Redux store per browser session (and a fresh one per server request). Feature slices are injected on demand:

```ts
export const injectUsersSlice = () =>
  injectContainer({ name: usersSlice.name, reducer: usersSlice.reducer, saga: usersSaga });
```

These `inject*Slice` functions are plain functions, not hooks, so they're safe to call from sagas.

**Side effects.** Login, joining outposts, reminders, passes and notifications live in redux-saga. Web3Auth is lazy-loaded from the init saga, so it stays out of the main bundle.

**Time.** Use `useClock(select, interval)` / `useNow()` from `lib/clock.ts` instead of `Date.now()` in render. `now` is `null` on the server. `select` must return a primitive, otherwise the component re-renders forever.

**Cache invalidation.** After mutations the client calls `/api/revalidate/*` (POST, same-origin only) to refresh tagged server caches.

---

## Design system (Aurora)

Theme tokens are CSS variables (`--p-accent`, `--p-surface`, `--p-text-muted`, …) defined per theme in `app/globals.css`, switchable from the header theme picker. Building blocks:

- Utilities: `glass-card`, `btn-aurora`, `bg-grad-primary`, `label-caps`, `animate-entrance`, `press`
- Components (`components/aurora`): `GlassCard`, `IconTile`, `Pill`, `Skeleton`, `OutpostThumb`, `AvatarStack`, `LiveDot`, `StatusPage`

User-facing copy says **outposts**, never "rooms".

---

## Security model

- **Auth token:** a cookie the API client sends as a Bearer token. It's cleared on logout and on any 401 for the current token.
- **Internal API routes** (`/api/revalidate/*`, `/api/cookies`, `/api/luma*`) accept same-origin requests only, or a valid `x-revalidate-secret` header. They validate ids and allowlist cookie names.
- **Luma:** the key never reaches the browser. `/api/luma/*` proxies an allowlist of endpoints and requires a signed-in Podium user for writes. Guest lists are never exposed. `/api/luma-access/:eventId` returns only `{ allowed }`.
- **Headers** (`next.config.ts`): `X-Frame-Options: DENY`, `nosniff`, a strict referrer policy, a Permissions-Policy (microphone for self only) and HSTS in production. The full CSP currently runs in **report-only** mode. Watch the console for violations before enforcing it.

---

## Conventions

- Branches: work on feature branches, merge into `develop`; `main` is production.
- Keep `yarn lint` at 0 errors and `yarn tsc --noEmit` clean before merging.
- Don't set state synchronously inside effects. Derive it during render, use `useSyncExternalStore` for browser APIs and storage, or set it from async callbacks.
- Don't read `window`, `localStorage` or `Date.now()` during render. Use `useHydrated`, `useSyncExternalStore` or `useClock`.

---

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Every page shows empty or error states | The backend in `NEXT_PUBLIC_PODIUM_API_URL` is down, or you're pointing at the wrong environment. Check with `curl "$NEXT_PUBLIC_PODIUM_API_URL/outposts?page=0&page_size=1"`. |
| Stale data after switching backends | `rm -rf .next/cache/fetch-cache` and rebuild |
| "Failed to initialize the app" toast | Web3Auth client ID doesn't match the network (devnet in `yarn dev`, mainnet in builds), or the origin isn't allow-listed in the Web3Auth dashboard |
| Type errors in `meet.tsx` after installing packages | Patches weren't applied. Run `npx patch-package`. |
| Luma details "unavailable" | `LUMA_API_KEY` missing, or the Luma calendar has no active Luma Plus plan |
| Push notifications don't work locally | Expected. OneSignal is bound to the production domain. |

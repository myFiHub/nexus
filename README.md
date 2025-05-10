# Podium Nexus

Podium Nexus is a next-generation Web3 platform for creator monetization, built on the Movement blockchain. It enables creators to monetize their content through lifetime memberships (Podium Passes), subscription tiers, and custom community spaces (Outposts).

---

## ⚡️ Tech Stack

- **Frontend:** React 19, Redux Toolkit, TypeScript
- **Build:** Vite 6, PostCSS, Tailwind CSS v4
- **State:** Redux slices (wallet, session, user, outposts, etc.)
- **Wallets:** Web3Auth (social login), Nightly (external wallet)
- **API:** Axios with JWT auth, environment-based base URL
- **Smart Contracts:** Movement/Aptos (Podium Protocol)

---

## ⚙️ Environment Variables

Set these in your `.env` file (do **not** commit secrets):

- `VITE_PODIUM_BACKEND_BASE_URL=https://prod.podium.myfihub.com/api/v1` (or your custom API URL)
- `VITE_PODIUM_PROTOCOL_APTOS_ADDRESS=...` (see below)
- `VITE_APTOS_NETWORK=mainnet`
- `VITE_WEB3AUTH_CLIENT_ID=...`

> **Note:** All API calls use the `VITE_PODIUM_BACKEND_BASE_URL` via Axios. Do not hardcode URLs in code.

---

## 🦾 Wallet & Authentication Flow

1. **Connect Wallet:**
   - Web3Auth (Google, Twitter, Email, etc.) or Nightly Wallet
2. **Sign Message:**
   - On first connect, user signs a login message
3. **JWT Auth:**
   - Signature is sent to `/auth/login` to receive a JWT
   - JWT is stored in Redux session slice (in-memory)
   - All API requests use JWT via Axios interceptor
4. **Data Fetching:**
   - User passes: `/podium-passes/my-passes`
   - Outposts: `/outposts`
   - On-chain data via Movement/Aptos contracts

---

## 🛠️ Development Workflow

- **Install:** `yarn install`
- **Run Dev:** `yarn dev`
- **Build:** `yarn build`
- **Preview:** `yarn preview`
- **Lint/Format:** Use your preferred tools

---

## 🧩 Core Features

- **Podium Passes:** Lifetime memberships, bonding curve pricing, transparent fees
- **Subscriptions:** Customizable tiers, smart contract-managed, referral incentives
- **Outposts:** Community spaces, deterministic addressing, advanced management
- **Growth:** Integrated referral system, rewards, analytics

---

## 🏗️ Architecture Highlights

- **Redux Slices:** wallet, session, user, outposts, etc.
- **Services:** walletService, podiumApiService, etc.
- **Axios:** All API calls use a single Axios instance with JWT interceptor
- **Tailwind 4:** Utility-first, dark mode, CSS variables for design tokens
- **Vite:** Fast dev/build, modern config

---

## 📝 Notes

- **Wallet state** is persisted in localStorage for session restore.
- **JWT** is kept in Redux (in-memory) for security.
- **API base URL** is always read from `VITE_PODIUM_BACKEND_BASE_URL`.
- **Do not edit the `.env` file** unless you know what you're doing.

---

For more, see `docs/ARCHITECTURE.md` and `docs/DESIGN_SYSTEM.md`.

# ⚠️ Environment Variables

- **Podium Protocol Address:**
  - `VITE_PODIUM_PROTOCOL_APTOS_ADDRESS=0xd2f0d0cf38a4c64620f8e9fcba104e0dd88f8d82963bef4ad57686c3ee9ed7aa`
- **Aptos Network:**
  - `VITE_APTOS_NETWORK=mainnet` (Movement Mainnet)
- **Web3Auth Client ID:**
  - `VITE_WEB3AUTH_CLIENT_ID=your_client_id_here`

> **Note:** Do not edit the `.env` file if instructed not to.

## Vision & Objectives

Our platform aims to:
- Accelerate user adoption by attracting creators and speculative investors
- Generate viral growth through SocialFi mechanics
- Provide creators with monetizable lifetime memberships and flexible subscription tiers
- Leverage bonding curve mechanisms for dynamic pricing and value appreciation

## Core Features

### Podium Passes (Lifetime Memberships)
- Buy and sell passes via bonding curve pricing
- Exponential price escalation promotes early adoption
- Lifetime access to creator benefits
- Transparent fee structure for protocol, creators, and referrals

### Subscription Management
- Customizable subscription tiers (weekly, monthly, yearly)
- Smart contract-managed renewable subscriptions
- Seamless integration with lifetime memberships
- Built-in referral incentives

### Outpost Creation & Management
- Create unique community spaces
- Fixed creation price with deterministic addressing
- Customizable fee share mechanism (default 5%)
- Advanced management tools including emergency controls

### Growth Mechanisms
- Integrated referral system
- Rewards structure:
  - Up to 2% trading fees
  - Up to 10% subscription fees

## Authentication

The platform supports multiple authentication methods:

1. **Web3Auth (Social Login)**
   - Sign in with Google, Twitter, Facebook, or other social accounts
   - Seamless onboarding for new users
   - Automatic wallet generation

2. **External Wallet (Nightly)**
   - Connect with existing Nightly wallet
   - Full control over private keys
   - Advanced user functionality

## Technical Architecture

### Smart Contract Integration
- **PodiumOutpost**: Outpost creation and management
- **PodiumPassCoin**: Fungible asset management
- **PodiumPass**: Core business logic for passes and subscriptions

### Bonding Curve Mechanics
- Initial pricing: 1-10 MOVE
- Exponential price escalation
- Transparent pricing formula

### Network Details
- Network: Movement Mainnet
- Chain ID: 126
- Protocol Address: 0xd2f0d0cf38a4c64620f8e9fcba104e0dd88f8d82963bef4ad57686c3ee9ed7aa

## Web3Auth + Aptos: Message Signing (Best Practice)

- Web3Auth does **NOT** natively support `aptos_signMessage` via the provider for Aptos.
- To sign messages (for authentication or transactions):
  1. Retrieve the private key from the provider:
     ```ts
     const rawPrivateKey = await provider.request({ method: 'private_key' });
     ```
  2. Convert the hex string to a `Uint8Array` and construct an `Ed25519Account` (or `Account` from `@aptos-labs/ts-sdk`):
     ```ts
     const privateKeyUint8Array = new Uint8Array(
       rawPrivateKey.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
     );
     const { Ed25519Account, Ed25519PrivateKey } = await import('@aptos-labs/ts-sdk');
     const ed25519PrivateKey = new Ed25519PrivateKey(privateKeyUint8Array.slice(0, 32));
     const aptosAccount = new Ed25519Account({ privateKey: ed25519PrivateKey });
     ```
  3. Use the SDK to sign the message:
     ```ts
     const encoder = new TextEncoder();
     const messageBuffer = encoder.encode(message);
     const signature = aptosAccount.signBuffer(messageBuffer);
     ```
- **Do not use `aptos_signMessage` with Web3Auth provider for Aptos.**
- This pattern is required for all authentication and transaction signing flows with Web3Auth + Aptos.

See `src/services/web3authService.ts` for the robust implementation.

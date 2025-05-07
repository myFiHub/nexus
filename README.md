# Podium Nexus

Podium Nexus is a Web3 platform that revolutionizes creator monetization through the Podium Protocol on the Movement blockchain. It enables creators to monetize their content through lifetime memberships (Podium Passes), subscription tiers, and custom community spaces (Outposts).

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

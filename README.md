# Podium Nexus

Podium Nexus is a web application for interacting with the Podium Protocol on the Aptos blockchain. It provides a user-friendly interface for managing passes, outposts, and subscriptions.

## Features

- **Web3Auth Integration**: Sign in with social accounts (Google, Twitter, Facebook, etc.)
- **External Wallet Support**: Connect with Nightly wallet for Aptos
- **Pass Management**: View, buy, and sell passes
- **Outpost Discovery**: Browse and interact with available outposts
- **Subscription Management**: Subscribe to outposts and manage subscriptions

## Authentication

The application supports multiple authentication methods:

1. **Web3Auth (Social Login)**
   - Sign in with Google, Twitter, Facebook, or other social accounts
   - Seamless onboarding for new users
   - No need to manage private keys

2. **External Wallet (Nightly)**
   - Connect with existing Nightly wallet
   - Full control over your private keys
   - Advanced users can use their preferred wallet

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

- `src/components`: Reusable UI components
- `src/context`: React context providers
- `src/pages`: Page components
- `src/services`: Service modules for API interactions
  - `authService.js`: Authentication service for Web3Auth and external wallets
  - `podiumProtocol.js`: Service for interacting with the Podium Protocol

## Technologies Used

- React
- Web3Auth
- Aptos SDK
- React Router
- Tailwind CSS

## License

This project is licensed under the MIT License - see the LICENSE file for details.

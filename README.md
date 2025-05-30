# Podium Nexus

Podium Nexus is a next-generation Web3 platform for creator monetization, built on the Movement blockchain. It enables creators to monetize their content through lifetime memberships (Podium Passes), subscription tiers, and custom community spaces (Outposts).

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/nexus.git
   cd nexus
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # API Configuration
   VITE_PODIUM_BACKEND_BASE_URL=https://prod.podium.myfihub.com/api/v1
   VITE_WEBSOCKET_ADDRESS=wss://ws.prod.podium.myfihub.com
   VITE_JITSI_SERVER_URL=https://outposts.myfihub.com

   # Web3Auth Configuration
   VITE_WEB3_AUTH_CLIENT_ID=your_web3auth_client_id
   VITE_WEB3_AUTH_CLIENT_SECRET=your_web3auth_client_secret

   # Movement/Aptos Configuration
   VITE_PODIUM_PROTOCOL_APTOS_ADDRESS=0xd2f0d0cf38a4c64620f8e9fcba104e0dd88f8d82963bef4ad57686c3ee9ed7aa
   VITE_INITIAL_EXTERNAL_WALLET_CHAIN_ID=126
   VITE_RPC_TARGET=https://mainnet.movementnetwork.xyz/v1
   VITE_CHAIN_DISPLAY_NAME=Movement
   VITE_BLOCK_EXPLORER=https://explorer.movementnetwork.xyz/?network=mainnet
   VITE_CHAIN_TICKER=MOVE
   VITE_CHAIN_TICKER_NAME=Movement

   # Optional: Additional API Keys
   VITE_PROJECT_ID=your_project_id
   VITE_ALBY_API_KEY=your_alby_api_key
   VITE_LUMA_API_KEY=your_luma_api_key
   VITE_ONESIGNAL_API_KEY=your_onesignal_api_key
   ```

4. **Start the development server:**
   ```bash
   yarn dev
   ```

5. **Build for production:**
   ```bash
   yarn build
   ```

## ⚡️ Tech Stack

- **Frontend:** React 19, Redux Toolkit, TypeScript
- **Build:** Vite 6, PostCSS, Tailwind CSS v4
- **State:** Redux slices (wallet, session, user, outposts, etc.)
- **Wallets:** Web3Auth (social login), Nightly (external wallet)
- **API:** Axios with JWT auth, environment-based base URL
- **Smart Contracts:** Movement/Aptos (Podium Protocol)

## 🧩 Core Features

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

## 🏗️ Architecture

### Frontend Architecture
- **State Management:** Redux Toolkit with slices for wallet, session, user, and outposts
- **Routing:** React Router with protected routes
- **Styling:** Tailwind CSS v4 with dark mode support
- **API Integration:** Axios with JWT authentication
- **Web3 Integration:** Web3Auth for social login, Nightly for external wallet

### Smart Contract Integration
- **PodiumOutpost:** Outpost creation and management
- **PodiumPassCoin:** Fungible asset management
- **PodiumPass:** Core business logic for passes and subscriptions

### Authentication Flow
1. **Connect Wallet:**
   - Web3Auth (Google, Twitter, Email) or Nightly Wallet
2. **Sign Message:**
   - On first connect, user signs a login message
3. **JWT Auth:**
   - Signature sent to `/auth/login` for JWT
   - JWT stored in Redux session slice
   - All API requests use JWT via Axios interceptor

## 🧪 Testing

1. **Unit Tests:**
   ```bash
   yarn test
   ```

2. **E2E Tests:**
   ```bash
   yarn test:e2e
   ```

3. **Coverage Report:**
   ```bash
   yarn test:coverage
   ```

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Dashboard Integration](docs/Dashboard_integration.md)

## 🔒 Security

- JWT tokens are stored in-memory (Redux) for security
- Wallet state is persisted in localStorage for session restore
- All API requests are authenticated via JWT
- Smart contract interactions use secure signing methods

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Movement Network for blockchain infrastructure
- Web3Auth for authentication solutions
- All contributors and supporters of the project

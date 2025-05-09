# Podium Platform Architecture

## System Overview

### Architecture Principles
1. **Decentralized First**
   - Smart contract-based business logic
   - Distributed data storage
   - Trustless interactions
   - Permissionless access

2. **Security by Design**
   - Zero-trust architecture
   - Defense in depth
   - Least privilege access
   - Immutable audit trails

3. **Scalability Focus**
   - Horizontal scaling
   - Asynchronous processing
   - Efficient caching
   - Load distribution

## Technical Stack

### Frontend Design Criteria & Best Practices
#### Visual/UX Criteria
- **Modern, Dark Theme:** Use a dark background (`#181A20` or similar) for the entire app. All cards, sections, and modals should use dark backgrounds with subtle contrast.
- **Brand Colors:** Use vibrant accent colors (e.g., fuchsia, blue) for CTAs, highlights, and links. Headings and buttons should use these brand colors for visual pop.
- **Typography:** Use a modern, sans-serif font (e.g., Inter). Headings should be bold and large (`text-4xl`/`text-5xl`), subheadings subtle (`text-neutral-400`).
- **Spacing & Layout:** Use generous vertical rhythm (`py-16`, `mb-12`, `gap-8`). Center content with `mx-auto`, `max-w-7xl`.
- **Cards & Containers:** All cards should be `bg-[#23263B]` or similar, with `rounded-xl`, `shadow-lg`, and ample padding.
- **Buttons:** Use consistent, bold button styles with `rounded-lg`, `px-6`, `py-3`, and brand colors. Use utility classes directly in JSX.
- **Section Separation:** Visually separate sections with background color changes or gradients.
- **Responsiveness:** All layouts must be mobile-first and responsive using Tailwind grid/flex utilities.
- **Accessibility:** Ensure color contrast, keyboard navigation, and ARIA labels for all interactive elements.

#### Tailwind v4+ Caveats & Best Practices
- **No @apply for Tailwind utility classes in CSS:** Use utility classes directly in JSX/HTML. Only use `@apply` for your own custom classes or CSS variable syntax.
- **Global Styles:** Set a global font and background in your main CSS file. Use Google Fonts for Inter or similar.
- **Utility-First:** All styling should be done with Tailwind utility classes in JSX, not custom CSS classes.
- **Custom Colors:** Use CSS variables for brand colors and reference them in utility classes with `[color:var(--brand-color)]` syntax.
- **Section-by-Section Build:** Build and test each section visually before moving to the next.
- **Pitfalls:**
  - Avoid mixing legacy CSS with Tailwind utilities.
  - Don't rely on custom classes for core layout or color.
  - Always check for color contrast and font readability on dark backgrounds.

#### Consultant/Developer Notes
- **Start with a global layout:** Navbar (sticky, dark, branded), main content (centered, padded), footer (simple, dark).
- **Rebuild each section (Hero, Features, Trending, How It Works) with only utility classes and modern design.**
- **Test visually after each change.**
- **Be prepared to delete and rewrite sections that look off.**
- **Document all design tokens and color variables.**

### Frontend Visual System & Component Map

#### 1. **Design Tokens & Brand Variables**
| Token Name         | Example Value      | Usage                                 |
|--------------------|-------------------|---------------------------------------|
| --color-bg         | #181A20           | App background                        |
| --color-surface    | #23263B           | Card/section backgrounds              |
| --color-primary    | #D946EF           | Brand accent (magenta/fuchsia)        |
| --color-secondary  | #2563EB           | Secondary accent (blue)               |
| --color-success    | #22C55E           | Success/positive                      |
| --color-error      | #EF4444           | Error/negative                        |
| --color-text-main  | #F3F4F6           | Main text                             |
| --color-text-muted | #A1A1AA           | Muted/subtle text                     |
| --font-main        | 'Inter', sans-serif | All text                            |
| --radius-lg        | 1rem              | Card/button border radius             |
| --shadow-lg        | 0 4px 32px #0004  | Card/button shadow                    |

> **All design tokens are defined as CSS variables in `src/index.css` and referenced in Tailwind utility classes using `[bg:var(--color-bg)]`, `[text:var(--color-text-main)]`, etc. No legacy CSS or custom class-based styling is used. All visual work is done with Tailwind utilities and variables.**

#### 2. **Component Map & Visual Structure**

- **Layout**
  - Sticky dark navbar (`bg-[var(--color-bg)]`, `border-b`, `shadow`)
  - Main content centered, `max-w-7xl`, `mx-auto`, `py-16`
  - Simple dark footer

- **Navbar**
  - Left: Logo (clickable)
  - Center/Right: Nav links (Home, Dashboard, Profile, Settings)
  - Far right: Wallet status (connect/disconnect, address, balance)
  - Mobile: Hamburger menu, slide-in nav

- **Base Components**
  - `Button`: Utility classes only, brand color, `rounded-lg`, `px-6`, `py-3`
  - `Card`: `bg-[var(--color-surface)]`, `rounded-xl`, `shadow-lg`, `p-8`
  - `Input`, `Select`: Full width, dark background, clear focus state

- **Home Page Sections**
  - **Hero:** Large gradient headline, subheading, two CTAs, subtle animation
  - **Feature Highlights:** 3 cards, icons, value-focused copy
  - **Trending Outposts:** Responsive grid, outpost cards with avatars/stats, "View All" link
  - **How It Works:** 4-step process, numbered circles, short descriptions

- **Explorer**
  - Grid of outpost cards, filters, search, pagination/infinite scroll

- **Outpost Detail**
  - Header: Avatar, name, creator, stats, CTAs
  - Pass trading: Price chart, buy/sell form
  - Subscription tiers: Cards for each tier, subscribe/upgrade/downgrade
  - Community feed: Posts, comments, likes (gated by pass/sub)

- **Dashboard**
  - User: Portfolio, transactions, followed outposts, quick actions
  - Creator: Outpost management, analytics, content manager

- **Notifications/Toasts**
  - Transaction status, errors, success, auto-dismiss, manual close

- **Wallet Modal**
  - Social login, wallet connect, error/loading states

#### 3. **On-Chain & Server Data Mapping**

| UI Component         | Data Source         | Data Fields Used                                  |
|----------------------|---------------------|---------------------------------------------------|
| Outpost Card         | Move contract       | name, avatar, stats (holders, price, volume)      |
| Pass Trading         | Move contract       | price, bonding curve, buy/sell, fees              |
| Subscription Tiers   | Move contract       | tier name, price, duration, benefits              |
| User Profile         | Server              | username, avatar, social links, badges            |
| Notifications        | Server/contract     | transaction status, alerts, content updates        |
| Community Feed       | Server (gated)      | posts, comments, likes, user info                 |

- **All contract data is fetched via PodiumSDK and mapped to UI components.**
- **User data, notifications, and content are fetched from the server and displayed in real time.**

#### 4. **Section-by-Section Build & QA**
- Build each section using only Tailwind utility classes and CSS variables.
- Test visually after each section.
- Delete/rewrite any section that does not meet visual or accessibility standards.
- Document all design tokens and color variables in this file.

---

### Frontend Architecture
```typescript
// Core Technologies

// Build & Development

```

### Smart Contract Architecture
```move
// Core Contracts
- PodiumProtocol.move
/* this includes  Base outpost functionality ;  Token (Podium passes  for target addresses/outposts) implementation;  Business logic & access control; Outpost deployment & management; Role-based permissions;  Price feed integration; Fee calculation & distribution

## Data Architecture

### Smart Contract Data Models
```move
struct Outpost {
    address owner;
    string name;
    string uri;
    uint256 createdAt;
    bool paused;
    PassConfig passConfig;
    SubscriptionConfig[] tiers;
}

struct PassConfig {
    uint256 initialPrice;
    uint256 weightB;
    uint256 creatorFee;
    uint256 referralFee;
    uint256 protocolFee;
}

struct SubscriptionConfig {
    string name;
    uint256 price;
    uint256 duration;
    uint256 maxSupply;
    string[] benefits;
}
```

### Frontend Data Models
```typescript
interface OutpostData {
  address: string;
  owner: string;
  name: string;
  uri: string;
  createdAt: number;
  paused: boolean;
  passConfig: PassConfig;
  tiers: SubscriptionConfig[];
  stats: OutpostStats;
}

interface PassConfig {
  initialPrice: BigNumber;
  weightB: number;
  creatorFee: number;
  referralFee: number;
  protocolFee: number;
}

interface SubscriptionConfig {
  id: number;
  name: string;
  price: BigNumber;
  duration: number;
  maxSupply: number;
  benefits: string[];
}

interface OutpostStats {
  totalSupply: number;
  holders: number;
  volume24h: BigNumber;
  price: BigNumber;
  marketCap: BigNumber;
}
```

## API Architecture

### Smart Contract Interface
```move
interface IPodiumOutpost {
    // Outpost Management
    function createOutpost(string name, string uri) external returns (address);
    function updateOutpost(OutpostConfig config) external;
    function pauseOutpost() external;
    function resumeOutpost() external;
    
    // Pass Management
    function buyPass(uint256 amount) external payable;
    function sellPass(uint256 amount) external;
    function getPassPrice() external view returns (uint256);
    
    // Subscription Management
    function createTier(SubscriptionConfig config) external;
    function subscribe(uint256 tierId) external payable;
    function cancelSubscription(uint256 tierId) external;
    
    // View Functions
    function getOutpostDetails() external view returns (Outpost);
    function getPassBalance(address holder) external view returns (uint256);
    function getSubscriptionStatus(address subscriber, uint256 tierId) 
        external view returns (SubscriptionStatus);
}
```

### Frontend API Integration
```typescript
class PodiumSDK {
    // Initialization
    constructor(provider: Web3Provider, config: PodiumConfig);
    
    // Outpost Management
    async createOutpost(params: CreateOutpostParams): Promise<OutpostData>;
    async updateOutpost(params: UpdateOutpostParams): Promise<void>;
    async getOutpostDetails(address: string): Promise<OutpostData>;
    
    // Pass Trading
    async buyPass(params: BuyPassParams): Promise<TransactionResponse>;
    async sellPass(params: SellPassParams): Promise<TransactionResponse>;
    async getPassPrice(outpostAddress: string): Promise<BigNumber>;
    
    // Subscription Management
    async subscribe(params: SubscribeParams): Promise<TransactionResponse>;
    async cancelSubscription(params: CancelSubParams): Promise<TransactionResponse>;
    
    // Analytics & Stats
    async getOutpostStats(address: string): Promise<OutpostStats>;
    async getUserPortfolio(address: string): Promise<PortfolioData>;
}
```

## State Management

### Frontend State Architecture
```typescript
// Redux Store Structure
interface RootState {
    wallet: WalletState;
    outposts: OutpostsState;
    transactions: TransactionsState;
    ui: UIState;
}

interface WalletState {
    address: string | null;
    chainId: number;
    balance: BigNumber;
    isConnecting: boolean;
    error: string | null;
}

interface OutpostsState {
    items: Record<string, OutpostData>;
    loading: boolean;
    error: string | null;
    filters: OutpostFilters;
    pagination: PaginationState;
}

interface TransactionsState {
    pending: Transaction[];
    history: Transaction[];
    error: string | null;
}
```

## Security Architecture

### Smart Contract Security
1. **Access Control**
   - Role-based permissions
   - Function modifiers
   - Ownership patterns
   - Emergency pause

2. **Economic Security**
   - Rate limiting
   - Price manipulation prevention
   - Fee validation
   - Slippage protection

3. **Technical Security**
   - Reentrancy guards
   - Integer overflow protection
   - Gas optimization
   - Secure randomness

### Frontend Security
1. **Authentication**
   - Web3Auth integration
   - Wallet connection security
   - Session management
   - JWT validation

2. **Transaction Security**
   - Transaction signing validation
   - Gas estimation
   - Network validation
   - Error handling

3. **Data Security**
   - Input validation
   - XSS prevention
   - CSRF protection
   - Secure storage

## Performance Architecture

### Smart Contract Optimization
1. **Gas Optimization**
   - Efficient data structures
   - Batch processing
   - View function optimization
   - Storage vs. Memory usage

2. **Transaction Throughput**
   - Event emission
   - Indexed parameters
   - Optimistic updates
   - State compression

### Frontend Optimization
1. **Loading Performance**
   - Code splitting
   - Tree shaking
   - Asset optimization
   - Lazy loading

2. **Runtime Performance**
   - Memoization
   - Virtual lists
   - Worker threads
   - Memory management

## Testing Architecture

### Smart Contract Testing
```move
// Test Categories
1. Unit Tests
   - Individual function testing
   - State transitions
   - Access control
   - Error conditions

2. Integration Tests
   - Contract interactions
   - Complex workflows
   - Economic scenarios
   - Edge cases

3. Security Tests
   - Fuzzing
   - Invariant testing
   - Symbolic execution
   - Formal verification
```

### Frontend Testing
```typescript
// Test Categories
1. Unit Tests
   - Component testing
   - Hook testing
   - Utility testing
   - State management

2. Integration Tests
   - Page testing
   - API integration
   - Wallet integration
   - Complex workflows

3. E2E Tests
   - User flows
   - Network conditions
   - Error scenarios
   - Performance testing
```

## Deployment Architecture

### Smart Contract Deployment
1. **Deployment Process**
   - Contract compilation
   - Network selection
   - Constructor parameters
   - Verification

2. **Upgrade Strategy**
   - Proxy patterns
   - State migration
   - Version control
   - Emergency procedures

### Frontend Deployment
1. **Build Process**
   - Environment configuration
   - Asset optimization
   - Cache strategy
   - CDN distribution

2. **Release Strategy**
   - Feature flags
   - A/B testing
   - Rollback procedures
   - Monitoring setup

## Monitoring Architecture

### Smart Contract Monitoring
1. **On-chain Monitoring**
   - Event tracking
   - State validation
   - Gas usage
   - Transaction success

2. **Economic Monitoring**
   - Price tracking
   - Volume analysis
   - Fee collection
   - Market manipulation

### Frontend Monitoring
1. **Performance Monitoring**
   - Page load times
   - API latency
   - Error rates
   - Resource usage

2. **User Monitoring**
   - Session tracking
   - Feature usage
   - Error reporting
   - Analytics integration

## Disaster Recovery

### Smart Contract Recovery
1. **Emergency Procedures**
   - Circuit breaker
   - Emergency withdrawal
   - State recovery
   - Upgrade execution

2. **Incident Response**
   - Detection
   - Assessment
   - Mitigation
   - Communication

### Frontend Recovery
1. **Error Recovery**
   - Fallback rendering
   - Retry mechanisms
   - State recovery
   - Cache invalidation

2. **Service Recovery**
   - Health checks
   - Auto-scaling
   - Load balancing
   - Backup deployment 
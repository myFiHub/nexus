/**
 * Application configuration
 * 
 * This file contains all configuration values for the application.
 * In a production environment, these values are loaded from environment variables.
 */

import { CHAIN_NAMESPACES } from "@web3auth/base";

// Debug logs for environment variables
console.log('[DEBUG] VITE_WEB3_AUTH_CLIENT_ID:', import.meta.env.VITE_WEB3_AUTH_CLIENT_ID);
console.log('[DEBUG] VITE_WEB3_AUTH_CLIENT_SECRET:', import.meta.env.VITE_WEB3_AUTH_CLIENT_SECRET);
console.log('[DEBUG] VITE_INITIAL_EXTERNAL_WALLET_CHAIN_ID:', import.meta.env.VITE_INITIAL_EXTERNAL_WALLET_CHAIN_ID);
console.log('[DEBUG] VITE_CHAIN_NAMESPACE:', import.meta.env.VITE_CHAIN_NAMESPACE);
console.log('[DEBUG] VITE_RPC_TARGET:', import.meta.env.VITE_RPC_TARGET);
console.log('[DEBUG] VITE_CHAIN_DISPLAY_NAME:', import.meta.env.VITE_CHAIN_DISPLAY_NAME);
console.log('[DEBUG] VITE_BLOCK_EXPLORER:', import.meta.env.VITE_BLOCK_EXPLORER);
console.log('[DEBUG] VITE_CHAIN_TICKER:', import.meta.env.VITE_CHAIN_TICKER);
console.log('[DEBUG] VITE_CHAIN_TICKER_NAME:', import.meta.env.VITE_CHAIN_TICKER_NAME);
console.log('[DEBUG] VITE_IS_TESTNET:', import.meta.env.VITE_IS_TESTNET);
console.log('[DEBUG] VITE_PROJECT_ID:', import.meta.env.VITE_PROJECT_ID);
console.log('[DEBUG] VITE_FIHUB_ADDRESS_APTOS:', import.meta.env.VITE_FIHUB_ADDRESS_APTOS);
console.log('[DEBUG] VITE_PODIUM_PROTOCOL_APTOS_ADDRESS:', import.meta.env.VITE_PODIUM_PROTOCOL_APTOS_ADDRESS);
console.log('[DEBUG] VITE_CHEERBOO_APTOS_ADDRESS:', import.meta.env.VITE_CHEERBOO_APTOS_ADDRESS);
console.log('[DEBUG] VITE_APTOS_NODE_URL:', import.meta.env.VITE_APTOS_NODE_URL);

// Add type declaration for Vite's import.meta.env
interface ImportMetaEnv {
  VITE_PODIUM_PROTOCOL_APTOS_ADDRESS?: string;
  VITE_PODIUM_BACKEND_BASE_URL?: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Type definitions
interface Web3AuthConfig {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  CHAIN_CONFIG: {
    chainNamespace: string;
    chainId: string;
    rpcTarget: string;
    displayName: string;
    blockExplorer: string;
    ticker: string;
    tickerName: string;
  };
  WEB3AUTH_NETWORK: string;
  ENABLE_LOGGING: boolean;
  SESSION_TIME: number;
  UI_CONFIG: {
    theme: string;
    loginMethodsOrder: string[];
    defaultLanguage: string;
    appLogo: string;
    mode: string;
    primaryButton: string;
  };
  AUTH_NETWORK: string;
  MFA_LEVEL: string;
  MFA_SETTINGS: {
    deviceShareFactor: {
      enable: boolean;
      priority: number;
      mandatory: boolean;
    };
    backUpShareFactor: {
      enable: boolean;
      priority: number;
      mandatory: boolean;
    };
    socialBackupFactor: {
      enable: boolean;
      priority: number;
      mandatory: boolean;
    };
    passwordFactor: {
      enable: boolean;
      priority: number;
      mandatory: boolean;
    };
  };
}

interface ContractAddresses {
  AVALANCHE: {
    FIHUB: string;
    STARS_ARENA: string;
    STARS_ARENA_PROXY: string;
  };
  BASECHAIN: {
    FRIENDTECH: string;
  };
  MOVEMENT: {
    CHEERBOO: string;
  };
  APTOS: {
    CHEERBOO: string;
    PODIUM_PROTOCOL: string;
    FIHUB: string;
  };
}

export interface PodiumProtocolConfig {
  CONTRACT_ADDRESS: string;
  RPC_URL: string;
  PARTNER_RPC_URLS: string[];
  rpcUrl: string;
}

interface ApiConfig {
  PROJECT_ID: string;
  ALBY_API_KEY: string;
  LUMA_API_KEY: string;
  ONESIGNAL_API_KEY: string;
  BACKEND_BASE_URL: string;
  WEBSOCKET_ADDRESS: string;
  JITSI_SERVER_URL: string;
}

interface DeepLinkingConfig {
  APP_STORE_URL: string;
  BASE_DEEP_LINK_URL: string;
}

interface CheerBooConfig {
  MINIMUM_AMOUNT: number;
  TIME_MULTIPLICATION: number;
}

interface UiConfig {
  ITEMS_PER_PAGE: number;
  DATE_FORMAT: string;
  CURRENCY_FORMAT: {
    MOVE: {
      SYMBOL: string;
      DECIMALS: number;
    };
  };
}

interface IndexerConfig {
  GRAPHQL_URL: string;
}

// Environment variable validation
const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value) {
    console.warn(`Warning: Environment variable ${name} is not set`);
    return '';
  }
  return value;
};

// Web3Auth configuration
export const WEB3AUTH_CONFIG: Web3AuthConfig = {
  CLIENT_ID: import.meta.env.VITE_WEB3_AUTH_CLIENT_ID || "",
  CLIENT_SECRET: import.meta.env.VITE_WEB3_AUTH_CLIENT_SECRET || "",
  CHAIN_CONFIG: {
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    chainId: import.meta.env.VITE_INITIAL_EXTERNAL_WALLET_CHAIN_ID || "126",
    rpcTarget: import.meta.env.VITE_RPC_TARGET || "https://mainnet.movementnetwork.xyz/v1",
    displayName: import.meta.env.VITE_CHAIN_DISPLAY_NAME || "Movement",
    blockExplorer: import.meta.env.VITE_BLOCK_EXPLORER || "https://explorer.movementnetwork.xyz/?network=mainnet",
    ticker: import.meta.env.VITE_CHAIN_TICKER || "MOVE",
    tickerName: import.meta.env.VITE_CHAIN_TICKER_NAME || "Movement"
  },
  WEB3AUTH_NETWORK: "sapphire_mainnet",
  ENABLE_LOGGING: true,
  SESSION_TIME: 86400,
  UI_CONFIG: {
    theme: "dark",
    loginMethodsOrder: ["google", "facebook", "twitter"],
    defaultLanguage: "en",
    appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
    mode: "auto",
    primaryButton: "socialLogin"
  },
  AUTH_NETWORK: "sapphire_mainnet",
  MFA_LEVEL: "none",
  MFA_SETTINGS: {
    deviceShareFactor: {
      enable: true,
      priority: 1,
      mandatory: false
    },
    backUpShareFactor: {
      enable: true,
      priority: 2,
      mandatory: false
    },
    socialBackupFactor: {
      enable: true,
      priority: 3,
      mandatory: false
    },
    passwordFactor: {
      enable: true,
      priority: 4,
      mandatory: false
    }
  }
};

// Contract Addresses
export const CONTRACT_ADDRESSES: ContractAddresses = {
  AVALANCHE: {
    FIHUB: validateEnvVar('VITE_FIHUB_ADDRESS_AVALANCHE_MAINNET', import.meta.env.VITE_FIHUB_ADDRESS_AVALANCHE_MAINNET),
    STARS_ARENA: validateEnvVar('VITE_STARS_ARENA_ADDRESS_AVALANCHE_MAINNET', import.meta.env.VITE_STARS_ARENA_ADDRESS_AVALANCHE_MAINNET),
    STARS_ARENA_PROXY: validateEnvVar('VITE_STARS_ARENA_PROXY_ADDRESS_AVALANCHE_MAINNET', import.meta.env.VITE_STARS_ARENA_PROXY_ADDRESS_AVALANCHE_MAINNET),
  },
  BASECHAIN: {
    FRIENDTECH: validateEnvVar('VITE_FRIENDTECH_ADDRESS_BASECHAIN_MAINNET', import.meta.env.VITE_FRIENDTECH_ADDRESS_BASECHAIN_MAINNET),
  },
  MOVEMENT: {
    CHEERBOO: validateEnvVar('VITE_CHEERBOO_ADDRESS_MOVEMENT_DEVNET', import.meta.env.VITE_CHEERBOO_ADDRESS_MOVEMENT_DEVNET),
  },
  APTOS: {
    CHEERBOO: validateEnvVar('VITE_CHEERBOO_APTOS_ADDRESS', import.meta.env.VITE_CHEERBOO_APTOS_ADDRESS),
    PODIUM_PROTOCOL: validateEnvVar('VITE_PODIUM_PROTOCOL_APTOS_ADDRESS', import.meta.env.VITE_PODIUM_PROTOCOL_APTOS_ADDRESS),
    FIHUB: validateEnvVar('VITE_FIHUB_ADDRESS_APTOS', import.meta.env.VITE_FIHUB_ADDRESS_APTOS),
  }
};

// Podium Protocol configuration
export const PODIUM_PROTOCOL_CONFIG: PodiumProtocolConfig = {
  CONTRACT_ADDRESS: import.meta.env.VITE_PODIUM_PROTOCOL_APTOS_ADDRESS || "0xd2f0d0cf38a4c64620f8e9fcba104e0dd88f8d82963bef4ad57686c3ee9ed7aa",
  RPC_URL: "/v1",
  PARTNER_RPC_URLS: [],
  rpcUrl: '/v1',
};

// API configuration
export const API_CONFIG: ApiConfig = {
  PROJECT_ID: validateEnvVar('VITE_PROJECT_ID', import.meta.env.VITE_PROJECT_ID),
  ALBY_API_KEY: validateEnvVar('VITE_ALBY_API_KEY', import.meta.env.VITE_ALBY_API_KEY),
  LUMA_API_KEY: validateEnvVar('VITE_LUMA_API_KEY', import.meta.env.VITE_LUMA_API_KEY),
  ONESIGNAL_API_KEY: validateEnvVar('VITE_ONESIGNAL_API_KEY', import.meta.env.VITE_ONESIGNAL_API_KEY),
  BACKEND_BASE_URL: import.meta.env.VITE_PODIUM_BACKEND_BASE_URL || "https://prod.podium.myfihub.com/api/v1",
  WEBSOCKET_ADDRESS: import.meta.env.VITE_WEBSOCKET_ADDRESS || "wss://ws.prod.podium.myfihub.com",
  JITSI_SERVER_URL: import.meta.env.VITE_JITSI_SERVER_URL || "https://outposts.myfihub.com",
};

// Deep linking configuration
export const DEEP_LINKING_CONFIG: DeepLinkingConfig = {
  APP_STORE_URL: import.meta.env.VITE_APP_STORE_URL || "https://play.google.com/store/apps/details?id=com.web3podium",
  BASE_DEEP_LINK_URL: import.meta.env.VITE_BASE_DEEP_LINK_URL || "https://web3podium.page.link",
};

// CheerBoo configuration
export const CHEERBOO_CONFIG: CheerBooConfig = {
  MINIMUM_AMOUNT: Number(import.meta.env.VITE_MINIMUM_CHEERBOO_AMOUNT) || 0.1,
  TIME_MULTIPLICATION: Number(import.meta.env.VITE_CHEERBOO_TIME_MULTIPLICATION) || 60,
};

// Version information
export const VERSION = import.meta.env.VITE_VERSION || "1.3.1";

// Local storage keys
export const STORAGE_KEYS = {
  EXTERNAL_WALLET: "podium_external_wallet",
};

// API endpoints
export const API_ENDPOINTS = {
  // Add API endpoints here when needed
};

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_SOCIAL_LOGIN: true,
  ENABLE_EXTERNAL_WALLET: true,
};

// UI configuration
export const UI_CONFIG: UiConfig = {
  ITEMS_PER_PAGE: 10,
  DATE_FORMAT: "MMM DD, YYYY",
  CURRENCY_FORMAT: {
    MOVE: {
      SYMBOL: "MOVE",
      DECIMALS: 8,
    }
  }
};

// Default values
export const DEFAULTS = {
  REFERRER_ADDRESS: null,
};

// Export the Aptos/Movement node URL from env
export const APTOS_NODE_URL = import.meta.env.VITE_APTOS_NODE_URL || 'https://mainnet.movementnetwork.xyz/v1';

/**
 * List of known MOVE coin types (native, FA, etc.) for Movement and Aptos.
 * Extend this list as new types are added to the ecosystem.
 */
export const MOVE_COIN_TYPES: string[] = [
  '0x1::aptos_coin::AptosCoin', // Aptos native
  '0x1::move::MOVE',            // Movement native
  '0xa::move::MOVE',            // FA MOVE (example, update as needed)
  '0x000000000000000000000000000000000000000000000000000000000000000a', // Movement mainnet MOVE
  // Add more as needed from bridge docs
];

export const INDEXER_CONFIG = {
  GRAPHQL_URL: import.meta.env.VITE_MOVEMENT_INDEXER_GRAPHQL_URL || "https://indexer.testnet.movementnetwork.xyz/v1/graphql",
};

export default {
  WEB3AUTH_CONFIG,
  PODIUM_PROTOCOL_CONFIG,
  CONTRACT_ADDRESSES,
  API_CONFIG,
  DEEP_LINKING_CONFIG,
  CHEERBOO_CONFIG,
  VERSION,
  STORAGE_KEYS,
  API_ENDPOINTS,
  FEATURE_FLAGS,
  UI_CONFIG,
  DEFAULTS,
  INDEXER_CONFIG,
}; 
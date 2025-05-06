/**
 * Application configuration
 * 
 * This file contains all configuration values for the application.
 * In a production environment, these values are loaded from environment variables.
 */

import { CHAIN_NAMESPACES } from "@web3auth/base";

// Debug logs for environment variables
console.log('[DEBUG] REACT_APP_WEB3_AUTH_CLIENT_ID:', process.env.REACT_APP_WEB3_AUTH_CLIENT_ID);
console.log('[DEBUG] REACT_APP_WEB3_AUTH_CLIENT_SECRET:', process.env.REACT_APP_WEB3_AUTH_CLIENT_SECRET);
console.log('[DEBUG] REACT_APP_INITIAL_EXTERNAL_WALLET_CHAIN_ID:', process.env.REACT_APP_INITIAL_EXTERNAL_WALLET_CHAIN_ID);
console.log('[DEBUG] REACT_APP_CHAIN_NAMESPACE:', process.env.REACT_APP_CHAIN_NAMESPACE);
console.log('[DEBUG] REACT_APP_RPC_TARGET:', process.env.REACT_APP_RPC_TARGET);
console.log('[DEBUG] REACT_APP_CHAIN_DISPLAY_NAME:', process.env.REACT_APP_CHAIN_DISPLAY_NAME);
console.log('[DEBUG] REACT_APP_BLOCK_EXPLORER:', process.env.REACT_APP_BLOCK_EXPLORER);
console.log('[DEBUG] REACT_APP_CHAIN_TICKER:', process.env.REACT_APP_CHAIN_TICKER);
console.log('[DEBUG] REACT_APP_CHAIN_TICKER_NAME:', process.env.REACT_APP_CHAIN_TICKER_NAME);
console.log('[DEBUG] REACT_APP_IS_TESTNET:', process.env.REACT_APP_IS_TESTNET);
console.log('[DEBUG] REACT_APP_PROJECT_ID:', process.env.REACT_APP_PROJECT_ID);
console.log('[DEBUG] REACT_APP_FIHUB_ADDRESS_APTOS:', process.env.REACT_APP_FIHUB_ADDRESS_APTOS);
console.log('[DEBUG] REACT_APP_PODIUM_PROTOCOL_APTOS_ADDRESS:', process.env.REACT_APP_PODIUM_PROTOCOL_APTOS_ADDRESS);
console.log('[DEBUG] REACT_APP_CHEERBOO_APTOS_ADDRESS:', process.env.REACT_APP_CHEERBOO_APTOS_ADDRESS);

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

interface PodiumProtocolConfig {
  CONTRACT_ADDRESS: string;
  RPC_URL: string;
  PARTNER_RPC_URLS: string[];
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
  CLIENT_ID: process.env.REACT_APP_WEB3_AUTH_CLIENT_ID || "",
  CLIENT_SECRET: process.env.REACT_APP_WEB3_AUTH_CLIENT_SECRET || "",
  CHAIN_CONFIG: {
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    chainId: process.env.REACT_APP_INITIAL_EXTERNAL_WALLET_CHAIN_ID || "126",
    rpcTarget: process.env.REACT_APP_RPC_TARGET || "https://mainnet.movementnetwork.xyz/v1",
    displayName: process.env.REACT_APP_CHAIN_DISPLAY_NAME || "Movement",
    blockExplorer: process.env.REACT_APP_BLOCK_EXPLORER || "https://explorer.movementnetwork.xyz/?network=mainnet",
    ticker: process.env.REACT_APP_CHAIN_TICKER || "MOVE",
    tickerName: process.env.REACT_APP_CHAIN_TICKER_NAME || "Movement"
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
    FIHUB: validateEnvVar('REACT_APP_FIHUB_ADDRESS_AVALANCHE_MAINNET', process.env.REACT_APP_FIHUB_ADDRESS_AVALANCHE_MAINNET),
    STARS_ARENA: validateEnvVar('REACT_APP_STARS_ARENA_ADDRESS_AVALANCHE_MAINNET', process.env.REACT_APP_STARS_ARENA_ADDRESS_AVALANCHE_MAINNET),
    STARS_ARENA_PROXY: validateEnvVar('REACT_APP_STARS_ARENA_PROXY_ADDRESS_AVALANCHE_MAINNET', process.env.REACT_APP_STARS_ARENA_PROXY_ADDRESS_AVALANCHE_MAINNET),
  },
  BASECHAIN: {
    FRIENDTECH: validateEnvVar('REACT_APP_FRIENDTECH_ADDRESS_BASECHAIN_MAINNET', process.env.REACT_APP_FRIENDTECH_ADDRESS_BASECHAIN_MAINNET),
  },
  MOVEMENT: {
    CHEERBOO: validateEnvVar('REACT_APP_CHEERBOO_ADDRESS_MOVEMENT_DEVNET', process.env.REACT_APP_CHEERBOO_ADDRESS_MOVEMENT_DEVNET),
  },
  APTOS: {
    CHEERBOO: validateEnvVar('REACT_APP_CHEERBOO_APTOS_ADDRESS', process.env.REACT_APP_CHEERBOO_APTOS_ADDRESS),
    PODIUM_PROTOCOL: validateEnvVar('REACT_APP_PODIUM_PROTOCOL_APTOS_ADDRESS', process.env.REACT_APP_PODIUM_PROTOCOL_APTOS_ADDRESS),
    FIHUB: validateEnvVar('REACT_APP_FIHUB_ADDRESS_APTOS', process.env.REACT_APP_FIHUB_ADDRESS_APTOS),
  }
};

// Podium Protocol configuration
export const PODIUM_PROTOCOL_CONFIG: PodiumProtocolConfig = {
  CONTRACT_ADDRESS: process.env.REACT_APP_PODIUM_PROTOCOL_APTOS_ADDRESS || "0xd2f0d0cf38a4c64620f8e9fcba104e0dd88f8d82963bef4ad57686c3ee9ed7aa",
  RPC_URL: "https://mainnet.movementnetwork.xyz/v1",
  PARTNER_RPC_URLS: [
    "https://movement.blockpi.network/rpc/v1/public/v1",
    "https://movement.lava.build/",
    "https://movement-rpc.nodeops.network/v1",
    "https://rpc.sentio.xyz/movement/v1",
    "https://movement.hellomoon.io/v1",
    "https://rpc.ankr.com/http/movement_mainnet/v1"
  ]
};

// API configuration
export const API_CONFIG: ApiConfig = {
  PROJECT_ID: validateEnvVar('REACT_APP_PROJECT_ID', process.env.REACT_APP_PROJECT_ID),
  ALBY_API_KEY: validateEnvVar('REACT_APP_ALBY_API_KEY', process.env.REACT_APP_ALBY_API_KEY),
  LUMA_API_KEY: validateEnvVar('REACT_APP_LUMA_API_KEY', process.env.REACT_APP_LUMA_API_KEY),
  ONESIGNAL_API_KEY: validateEnvVar('REACT_APP_ONESIGNAL_API_KEY', process.env.REACT_APP_ONESIGNAL_API_KEY),
  BACKEND_BASE_URL: process.env.REACT_APP_PODIUM_BACKEND_BASE_URL || "https://prod.podium.myfihub.com/api/v1",
  WEBSOCKET_ADDRESS: process.env.REACT_APP_WEBSOCKET_ADDRESS || "wss://ws.prod.podium.myfihub.com",
  JITSI_SERVER_URL: process.env.REACT_APP_JITSI_SERVER_URL || "https://outposts.myfihub.com",
};

// Deep linking configuration
export const DEEP_LINKING_CONFIG: DeepLinkingConfig = {
  APP_STORE_URL: process.env.REACT_APP_APP_STORE_URL || "https://play.google.com/store/apps/details?id=com.web3podium",
  BASE_DEEP_LINK_URL: process.env.REACT_APP_BASE_DEEP_LINK_URL || "https://web3podium.page.link",
};

// CheerBoo configuration
export const CHEERBOO_CONFIG: CheerBooConfig = {
  MINIMUM_AMOUNT: Number(process.env.REACT_APP_MINIMUM_CHEERBOO_AMOUNT) || 0.1,
  TIME_MULTIPLICATION: Number(process.env.REACT_APP_CHEERBOO_TIME_MULTIPLICATION) || 60,
};

// Version information
export const VERSION = process.env.REACT_APP_VERSION || "1.3.1";

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
}; 
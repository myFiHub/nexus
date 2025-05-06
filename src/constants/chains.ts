import { Chain } from 'viem';

export const eth = {
  id: 1,
  name: 'Ethereum',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://eth.llamarpc.com'],
    },
    public: {
      http: ['https://eth.llamarpc.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://etherscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601,
    },
  },
} as const satisfies Chain;

export const move = {
  id: 126,
  name: 'Movement',
  nativeCurrency: {
    decimals: 8,
    name: 'Movement',
    symbol: 'MOVE',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.movementnetwork.xyz/v1'],
    },
    public: {
      http: ['https://mainnet.movementnetwork.xyz/v1'],
    },
  },
  blockExplorers: {
    default: { name: 'MovementExplorer', url: 'https://explorer.movementnetwork.xyz/?network=mainnet' },
  },
 
} as const satisfies Chain; 
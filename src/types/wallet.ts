// Wallet type definition for Podium Platform
// Represents the connected wallet state

export interface Wallet {
  address: string | null;
  chainId: number;
  balance: string; // BigNumber as string
  isConnecting: boolean;
  error: string | null;
} 
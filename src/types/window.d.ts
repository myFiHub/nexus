interface MovementWallet {
  connect: () => Promise<any>;
  disconnect: () => Promise<void>;
  isConnected: () => Promise<boolean>;
  signAndSubmitTransaction: (transaction: any) => Promise<any>;
  signTransaction: (transaction: any) => Promise<any>;
}

interface Window {
  movement?: MovementWallet;
} 
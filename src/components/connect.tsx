import { PropsWithChildren, useEffect, useState } from 'react';
import { WagmiConfig } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WalletServicesProvider, WalletServicesContext } from '@web3auth/wallet-services-plugin-react-hooks';
import { WalletServicesPlugin } from '@web3auth/wallet-services-plugin';
import { getWeb3AuthInstance } from './w3aContext';
import { wagmiConfig, queryClient } from './config';

export const WalletConnect = ({ children }: PropsWithChildren<unknown>) => {
  const [walletServicesPlugin, setWalletServicesPlugin] = useState<WalletServicesPlugin | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = getWeb3AuthInstance();
        console.debug('[Web3Auth] Initializing modal...');
        await web3auth.initModal();
        const plugin = new WalletServicesPlugin({
          wsEmbedOpts: { modalZIndex: 99999 },
        });
        web3auth.addPlugin(plugin);
        setWalletServicesPlugin(plugin);
        console.debug('[Web3Auth] WalletServicesPlugin added and ready.');
      } catch (error) {
        console.error('[Web3Auth] Failed to initialize:', error);
      }
    };
    init();
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {walletServicesPlugin ? (
          // @ts-expect-error: WalletServicesContext is compatible at runtime
          <WalletServicesProvider context={WalletServicesContext}>
            <RainbowKitProvider>
              {children}
            </RainbowKitProvider>
          </WalletServicesProvider>
        ) : (
          <div>Initializing Web3Auth...</div>
        )}
      </QueryClientProvider>
    </WagmiConfig>
  );
}; 
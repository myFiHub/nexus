import React, { useMemo } from 'react';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base';
import { WEB3AUTH_CONFIG } from '../config/config';

const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const web3auth = useMemo(() => {
    if (!WEB3AUTH_CONFIG.CLIENT_ID) {
      console.error('Web3Auth client ID is not set. Please check your environment variables.');
      throw new Error('Web3Auth client ID is not set');
    }

    const instance = new Web3AuthNoModal({
      clientId: WEB3AUTH_CONFIG.CLIENT_ID,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
        chainId: WEB3AUTH_CONFIG.CHAIN_CONFIG.chainId,
        rpcTarget: WEB3AUTH_CONFIG.CHAIN_CONFIG.rpcTarget,
        displayName: WEB3AUTH_CONFIG.CHAIN_CONFIG.displayName,
        blockExplorerUrl: WEB3AUTH_CONFIG.CHAIN_CONFIG.blockExplorer,
        ticker: WEB3AUTH_CONFIG.CHAIN_CONFIG.ticker,
        tickerName: WEB3AUTH_CONFIG.CHAIN_CONFIG.tickerName,
      },
      web3AuthNetwork: 'mainnet',
    });
    return instance;
  }, []);

  return (
    <div>
      {children}
    </div>
  );
};

export default Web3AuthProvider; 
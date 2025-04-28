import React, { useMemo } from 'react';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base';
import { WEB3AUTH_CONFIG } from '../constants/web3authConfig';

const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const web3auth = useMemo(() => {
    const instance = new Web3AuthNoModal({
      clientId: WEB3AUTH_CONFIG.clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
        chainId: WEB3AUTH_CONFIG.chainConfig.chainId,
        rpcTarget: WEB3AUTH_CONFIG.chainConfig.rpcTarget,
        displayName: WEB3AUTH_CONFIG.chainConfig.displayName,
        blockExplorerUrl: WEB3AUTH_CONFIG.chainConfig.blockExplorerUrl,
        ticker: WEB3AUTH_CONFIG.chainConfig.ticker,
        tickerName: WEB3AUTH_CONFIG.chainConfig.tickerName,
      },
      web3AuthNetwork: WEB3AUTH_CONFIG.web3AuthNetwork,
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
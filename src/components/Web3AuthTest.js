import React, { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";

const Web3AuthTest = () => {
  const [web3auth, setWeb3auth] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      try {
        const web3authInstance = new Web3Auth({
          clientId: process.env.REACT_APP_WEB3_AUTH_CLIENT_ID,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: process.env.REACT_APP_INITIAL_EXTERNAL_WALLET_CHAIN_ID || "126",
            rpcTarget: process.env.REACT_APP_RPC_TARGET,
            displayName: process.env.REACT_APP_CHAIN_DISPLAY_NAME,
            blockExplorer: process.env.REACT_APP_BLOCK_EXPLORER,
            ticker: process.env.REACT_APP_CHAIN_TICKER,
            tickerName: process.env.REACT_APP_CHAIN_TICKER_NAME,
          },
        });
        await web3authInstance.initModal();
        setWeb3auth(web3authInstance);
        setError(null);
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, []);

  const handleLogin = async () => {
    if (!web3auth) return;
    try {
      await web3auth.connect();
      const userInfo = await web3auth.getUserInfo();
      setUser(userInfo);
      setError(null);
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 500, margin: "0 auto" }}>
      <h2>Web3Auth Minimal Test</h2>
      {isInitializing && <div>Initializing Web3Auth...</div>}
      {error && <div style={{ color: "red", margin: "12px 0" }}>Error: {error}</div>}
      {user ? (
        <div>
          <div>Logged in as: {user.name || user.email}</div>
          <pre style={{ background: "#f4f4f4", padding: 12, borderRadius: 4 }}>{JSON.stringify(user, null, 2)}</pre>
        </div>
      ) : (
        <button onClick={handleLogin} disabled={!web3auth || isInitializing} style={{ padding: "8px 16px", fontSize: 16 }}>
          Connect with Web3Auth
        </button>
      )}
    </div>
  );
};

export default Web3AuthTest; 
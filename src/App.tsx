import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Layout from './components/Layout';
import OutpostDetail from './pages/OutpostDetail';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Explorer from './pages/Explorer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import web3AuthService from './services/web3authService';
import { WEB3AUTH_CONFIG } from './config/config';
import walletService from './services/walletService';
import { setWallet } from './redux/slices/walletSlice';

// Main App entry point with routing
const App: React.FC = () => {
  const [web3AuthReady, setWeb3AuthReady] = React.useState(false);

  React.useEffect(() => {
    console.debug('[App] Initializing Web3Auth...');
    web3AuthService
      .init(
        WEB3AUTH_CONFIG.CLIENT_ID,
        WEB3AUTH_CONFIG.CHAIN_CONFIG.rpcTarget,
        WEB3AUTH_CONFIG.CHAIN_CONFIG.blockExplorer
      )
      .then(() => {
        setWeb3AuthReady(true);
        console.debug('[App] Web3Auth initialized');
      })
      .catch((err) => {
        console.error('[App] Web3Auth initialization failed:', err);
      });
  }, []);

  // Restore wallet session from localStorage on app load
  React.useEffect(() => {
    if (!web3AuthReady) return;
    const walletRaw = localStorage.getItem('wallet');
    if (walletRaw) {
      try {
        const wallet = JSON.parse(walletRaw);
        if (wallet && wallet.address) {
          console.debug('[App] Restoring wallet from localStorage:', wallet);
          store.dispatch(setWallet({ ...wallet, provider: null }));
          walletService.syncWalletSession(store.dispatch);
        }
      } catch (e) {
        console.error('[App] Failed to restore wallet from localStorage:', e);
      }
    } else {
      console.debug('[App] No wallet found in localStorage to restore.');
    }
  }, [web3AuthReady]);

  if (!web3AuthReady) {
    return <div>Initializing Web3Auth...</div>;
  }

  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/outposts/:address" element={<OutpostDetail />} />
            <Route path="/creators/:address" element={<OutpostDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App; 
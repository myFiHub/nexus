import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppLayout from './components/layout/AppLayout';
import UnifiedExplorer from './components/common/UnifiedExplorer';
import OutpostDetail from './components/outpost/OutpostDetail';
import CreatorDetail from './components/creator/CreatorDetail';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import web3AuthService from './services/web3authService';
import { WEB3AUTH_CONFIG } from './config/config';

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

  if (!web3AuthReady) {
    return <div>Initializing Web3Auth...</div>;
  }

  return (
    <Provider store={store}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/explorer" replace />} />
            <Route path="/explorer" element={<UnifiedExplorer />} />
            <Route path="/outposts/:address" element={<OutpostDetail />} />
            <Route path="/creators/:address" element={<CreatorDetail />} />
          </Routes>
        </AppLayout>
      </Router>
    </Provider>
  );
};

export default App; 
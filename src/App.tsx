import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppLayout from './components/layout/AppLayout';
import UnifiedExplorer from './components/common/UnifiedExplorer';
import OutpostDetail from './components/outpost/OutpostDetail';
import CreatorDetail from './components/creator/CreatorDetail';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Main App entry point with routing
const App: React.FC = () => {
  React.useEffect(() => {
    console.debug('[App] Mounted');
  }, []);

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
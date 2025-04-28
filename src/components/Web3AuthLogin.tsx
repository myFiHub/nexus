import React, { useState } from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';
import { WEB3AUTH_PROVIDERS } from '../constants/web3auth';
import './Web3AuthLogin.css';

export const Web3AuthLogin: React.FC = () => {
  const { login, logout, user, isAuthenticated, error } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (provider: string) => {
    try {
      setIsLoading(true);
      await login(provider as any);
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="web3auth-profile">
        <h2>Welcome, {user.userInfo.name || 'User'}!</h2>
        <div className="profile-info">
          {user.userInfo.profileImage && (
            <img
              src={user.userInfo.profileImage}
              alt="Profile"
              className="profile-image"
            />
          )}
          <p>Email: {user.userInfo.email}</p>
          <p>Provider: {user.userInfo.typeOfLogin}</p>
        </div>
        <button
          className="logout-button"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    );
  }

  return (
    <div className="web3auth-login">
      <h2>Login with Web3Auth</h2>
      {error && <div className="error-message">{error.message}</div>}
      <div className="login-options">
        <button
          className="login-button google"
          onClick={() => handleLogin(WEB3AUTH_PROVIDERS.GOOGLE)}
          disabled={isLoading}
        >
          <span className="icon">G</span>
          {isLoading ? 'Connecting...' : 'Continue with Google'}
        </button>
        <button
          className="login-button facebook"
          onClick={() => handleLogin(WEB3AUTH_PROVIDERS.FACEBOOK)}
          disabled={isLoading}
        >
          <span className="icon">f</span>
          {isLoading ? 'Connecting...' : 'Continue with Facebook'}
        </button>
        <button
          className="login-button twitter"
          onClick={() => handleLogin(WEB3AUTH_PROVIDERS.TWITTER)}
          disabled={isLoading}
        >
          <span className="icon">𝕏</span>
          {isLoading ? 'Connecting...' : 'Continue with Twitter'}
        </button>
        <button
          className="login-button discord"
          onClick={() => handleLogin(WEB3AUTH_PROVIDERS.DISCORD)}
          disabled={isLoading}
        >
          <span className="icon">D</span>
          {isLoading ? 'Connecting...' : 'Continue with Discord'}
        </button>
        <button
          className="login-button github"
          onClick={() => handleLogin(WEB3AUTH_PROVIDERS.GITHUB)}
          disabled={isLoading}
        >
          <span className="icon">G</span>
          {isLoading ? 'Connecting...' : 'Continue with GitHub'}
        </button>
        <button
          className="login-button email"
          onClick={() => handleLogin(WEB3AUTH_PROVIDERS.EMAIL)}
          disabled={isLoading}
        >
          <span className="icon">✉</span>
          {isLoading ? 'Connecting...' : 'Continue with Email'}
        </button>
      </div>
    </div>
  );
}; 
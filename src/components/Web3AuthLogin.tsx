import React from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';
import { WEB3AUTH_PROVIDERS } from '../constants/web3authProviders';
import './Web3AuthLogin.css';

const Web3AuthLogin: React.FC = () => {
  const { isConnected, userInfo, error, login, logout } = useWeb3Auth();

  const handleLogin = async (provider: string) => {
    try {
      await login(provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isConnected && userInfo) {
    return (
      <div className="web3auth-profile">
        <h2>Welcome, {userInfo.name || userInfo.email}</h2>
        <div className="profile-info">
          <p>Email: {userInfo.email}</p>
          {userInfo.profileImage && (
            <img src={userInfo.profileImage} alt="Profile" className="profile-image" />
          )}
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="web3auth-login">
      <h2>Login with Web3Auth</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="login-options">
        <button 
          className="login-button google" 
          onClick={() => handleLogin(WEB3AUTH_PROVIDERS.GOOGLE)}
        >
          <span className="icon">G</span>
          <span>Login with Google</span>
        </button>
        <button 
          className="login-button facebook" 
          onClick={() => handleLogin(WEB3AUTH_PROVIDERS.FACEBOOK)}
        >
          <span className="icon">F</span>
          <span>Login with Facebook</span>
        </button>
        <button 
          className="login-button twitter" 
          onClick={() => handleLogin(WEB3AUTH_PROVIDERS.TWITTER)}
        >
          <span className="icon">T</span>
          <span>Login with Twitter</span>
        </button>
        <button 
          className="login-button discord" 
          onClick={() => handleLogin(WEB3AUTH_PROVIDERS.DISCORD)}
        >
          <span className="icon">D</span>
          <span>Login with Discord</span>
        </button>
        <button 
          className="login-button github" 
          onClick={() => handleLogin(WEB3AUTH_PROVIDERS.GITHUB)}
        >
          <span className="icon">GH</span>
          <span>Login with GitHub</span>
        </button>
        <button 
          className="login-button email" 
          onClick={() => handleLogin(WEB3AUTH_PROVIDERS.EMAIL_PASSWORDLESS)}
        >
          <span className="icon">E</span>
          <span>Login with Email</span>
        </button>
      </div>
    </div>
  );
};

export default Web3AuthLogin; 
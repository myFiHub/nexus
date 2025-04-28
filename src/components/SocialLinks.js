import React from 'react';
import { Link } from 'react-router-dom';
import './SocialLinks.css';

const SocialLinks = () => {
  return (
    <div className="social-links-container">
      <div className="social-icons">
        <a 
          href="https://twitter.com/web3podium" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon-link"
        >
          <img src="/assets/images/x_platform.png" alt="Twitter" className="social-icon" />
        </a>
        <a 
          href="https://discord.gg/3yfQDEa5Uf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon-link"
        >
          <img src="/assets/images/discord.svg" alt="Discord" className="social-icon" />
        </a>
        <a 
          href="https://github.com/orgs/myFiHub/repositories" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon-link"
        >
          <img src="/assets/images/github.png" alt="GitHub" className="social-icon" />
        </a>
      </div>
      
      <div className="app-download-section">
        <h3 className="text-xl font-semibold mb-4">Download Podium App</h3>
        <div className="app-buttons">
          <a 
            href="https://apps.apple.com/us/app/podium-own-the-conversation/id6737725547" 
            target="_blank" 
            rel="noopener noreferrer"
            className="app-store-button"
          >
            <img src="/assets/images/apple.png" alt="App Store" className="app-store-icon" />
            <span>Download on App Store</span>
          </a>
          <a 
            href="https://play.google.com/store/apps/details?id=com.web3podium" 
            target="_blank" 
            rel="noopener noreferrer"
            className="app-store-button"
          >
            <img src="/assets/images/g_icon.png" alt="Google Play" className="app-store-icon" />
            <span>Get it on Google Play</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks; 
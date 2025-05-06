const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get network from command line arguments or use default
const network = process.argv[2] || 'devnet';

// Create config directory if it doesn't exist
const configDir = path.join(__dirname, '../move/.aptos');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// Create or update config.yaml
const configPath = path.join(configDir, 'config.yaml');
const config = {
  "---": null,
  "WORKSPACE": {
    "DEFAULT": {
      "private_key": "0x0000000000000000000000000000000000000000000000000000000000000001",
      "public_key": "0x0000000000000000000000000000000000000000000000000000000000000001",
      "account": "0x0000000000000000000000000000000000000000000000000000000000000001",
      "rest_url": network === 'mainnet' 
        ? "https://fullnode.mainnet.aptoslabs.com"
        : network === 'testnet'
        ? "https://fullnode.testnet.aptoslabs.com"
        : "https://fullnode.devnet.aptoslabs.com",
      "faucet_url": network === 'mainnet'
        ? "https://faucet.mainnet.aptoslabs.com"
        : network === 'testnet'
        ? "https://faucet.testnet.aptoslabs.com"
        : "https://faucet.devnet.aptoslabs.com"
    }
  }
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

// Generate a new account using Aptos CLI
try {
  execSync(`aptos key generate --output-file ${path.join(configDir, 'key.json')}`, { stdio: 'inherit' });
  console.log('Account created successfully!');
} catch (error) {
  console.error('Error creating account:', error.message);
  process.exit(1);
} 
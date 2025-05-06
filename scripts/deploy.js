const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get network from command line arguments or use default
const network = process.argv[2] || 'devnet';

// Path to Move sources
const sourcesPath = path.join(__dirname, '../move/sources');

// Check if sources directory exists and has Move files
if (!fs.existsSync(sourcesPath) || !fs.readdirSync(sourcesPath).some(file => file.endsWith('.move'))) {
  console.error('No Move source files found in', sourcesPath);
  process.exit(1);
}

// Deploy Move modules
try {
  console.log(`Deploying Move modules to ${network}...`);
  
  // Compile and publish modules
  execSync(`aptos move publish --package-dir ${path.join(__dirname, '../move')} --network ${network}`, {
    stdio: 'inherit'
  });
  
  console.log('Move modules deployed successfully!');
  
  // Update move.config.js with deployed module addresses
  const moveConfigPath = path.join(__dirname, '../move.config.js');
  if (fs.existsSync(moveConfigPath)) {
    const moveConfig = require(moveConfigPath);
    // You can add logic here to update module addresses if needed
    fs.writeFileSync(moveConfigPath, `module.exports = ${JSON.stringify(moveConfig, null, 2)}`);
  }
} catch (error) {
  console.error('Error deploying Move modules:', error.message);
  process.exit(1);
} 
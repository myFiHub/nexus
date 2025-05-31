import { ethers, verifyMessage } from 'ethers';

class EthereumService {
  private static instance: EthereumService;

  private constructor() {}

  public static getInstance(): EthereumService {
    if (!EthereumService.instance) {
      EthereumService.instance = new EthereumService();
    }
    return EthereumService.instance;
  }

  /**
   * Creates an Ethereum wallet from a private key
   * @param privateKey The private key in hex format
   * @returns The Ethereum wallet instance
   */
  public createWallet(privateKey: string): ethers.Wallet {
    return new ethers.Wallet(privateKey);
  }

  /**
   * Signs a message using Ethereum's personal_sign format
   * @param privateKey The private key in hex format
   * @param message The message to sign
   * @returns The signature in hex format
   */
  public async signMessage(privateKey: string, message: string): Promise<string> {
    const wallet = this.createWallet(privateKey);
    console.debug(`[ethereumService] Signing message: ${message}`);
    console.debug(`[ethereumService] Using wallet address: ${wallet.address}`);
    
    const signature = await wallet.signMessage(message);
    console.debug(`[ethereumService] Raw signature: ${signature}`);
    console.debug(`[ethereumService] Signature length: ${signature.length}`);
    
    // Validate signature length
    if (signature.length !== 132) {
      console.error(`[ethereumService] Invalid signature length: ${signature.length}. Expected 132 characters.`);
      console.debug(`[ethereumService] Full signature: ${signature}`);
      throw new Error(`Invalid signature length: ${signature.length}. Expected 132 characters.`);
    }
    
    return signature;
  }

  /**
   * Verifies an Ethereum signature
   * @param message The original message
   * @param signature The signature to verify
   * @returns The recovered address
   */
  public verifySignature(message: string, signature: string): string {
    console.debug(`[ethereumService] Verifying signature for message: ${message}`);
    console.debug(`[ethereumService] Signature to verify: ${signature}`);
    console.debug(`[ethereumService] Signature length: ${signature.length}`);
    
    // Validate signature length before verification
    if (signature.length !== 132) {
      console.error(`[ethereumService] Invalid signature length: ${signature.length}. Expected 132 characters.`);
      console.debug(`[ethereumService] Full signature: ${signature}`);
      throw new Error(`Invalid signature length: ${signature.length}. Expected 132 characters.`);
    }
    
    const recovered = verifyMessage(message, signature);
    console.debug(`[ethereumService] Recovered address: ${recovered}`);
    return recovered;
  }
}

export default EthereumService.getInstance(); 
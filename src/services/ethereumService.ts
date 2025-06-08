import { ethers } from 'ethers';

interface SignatureVerification {
  isValid: boolean;
  recoveredAddress: string;
}

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
   * Converts a hex string to Uint8Array
   * @param hex The hex string (with or without 0x prefix)
   * @returns Uint8Array
   */
  private hexToBytes(hex: string): Uint8Array {
    const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.slice(i, i + 2), 16);
    }
    return bytes;
  }

  /**
   * Converts a Uint8Array to hex string
   * @param bytes The Uint8Array
   * @returns Hex string without 0x prefix
   */
  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Get Ethereum address from private key
   * @param privateKey Raw private key hex string
   * @returns Ethereum address
   */
  public getAddressFromPrivateKey(privateKey: string): string {
    const wallet = this.createWallet(privateKey);
    return wallet.address;
  }

  /**
   * Sign a message using the private key
   * @param privateKey Raw private key hex string  
   * @param message The message to sign
   * @returns Signature as hex string (without 0x prefix)
   */
  public async signMessage(privateKey: string, message: string): Promise<string> {
    console.debug(`[ethereumService] Signing message: ${message}`);
    const wallet = this.createWallet(privateKey);
    console.debug(`[ethereumService] Using wallet address: ${wallet.address}`);
    
    // Format message exactly like backend: "\x19Ethereum Signed Message:\n" + message.length + message
    const ethMessage = "\x19Ethereum Signed Message:\n" + message.length + message;
    const ethMessageBytes = new TextEncoder().encode(ethMessage);
    console.debug(`[ethereumService] Formatted message:`, {
      raw: ethMessage,
      bytes: this.bytesToHex(ethMessageBytes)
    });

    // Hash the message using keccak256
    const messageHash = ethers.keccak256(ethMessageBytes);
    console.debug(`[ethereumService] Message hash:`, {
      hash: messageHash,
      bytes: messageHash.slice(2) // Remove 0x prefix for logging
    });

    // Sign the hash
    const rawSignature = wallet.signingKey.sign(messageHash);
    console.debug(`[ethereumService] Raw signature:`, rawSignature);

    const r = rawSignature.r;
    const s = rawSignature.s;
    let v = rawSignature.v;
    
    console.debug(`[ethereumService] Initial recovery ID: ${v}`);
    
    // Convert recovery ID to match backend logic
    let recoveryId: number;
    if (v === 27) {
      recoveryId = 27;
    } else if (v === 28) {
      recoveryId = 28;
    } else if (v >= 35) {
      recoveryId = ((v - 1) % 2) + 27;
    } else {
      throw new Error(`Invalid recovery ID: ${v}`);
    }

    console.debug(`[ethereumService] Signature components:`, {
      r: r.slice(2), // Remove 0x prefix
      s: s.slice(2), // Remove 0x prefix
      v: recoveryId.toString(16).padStart(2, '0')
    });

    // Convert to bytes and concatenate: r(32) + s(32) + v(1) = 65 bytes total
    const rBytes = this.hexToBytes(r);
    const sBytes = this.hexToBytes(s);
    const vBytes = new Uint8Array([recoveryId]);

    const signatureBytes = new Uint8Array(65);
    signatureBytes.set(rBytes, 0);    // r at position 0-31
    signatureBytes.set(sBytes, 32);   // s at position 32-63  
    signatureBytes.set(vBytes, 64);   // v at position 64

    const signature = this.bytesToHex(signatureBytes);
    console.debug(`[ethereumService] Final signature:`, {
      bytes: signature,
      length: signature.length,
      signature: signature
    });

    return signature;
  }

  /**
   * Verifies an Ethereum signature
   * @param message The original message
   * @param signature The signature to verify (with or without 0x prefix)
   * @returns The recovered address in uppercase to match backend format
   */
  public async verifySignature(message: string, signature: string): Promise<SignatureVerification> {
    try {
      console.debug(`[ethereumService] Verifying signature for message: ${message}`);
      console.debug(`[ethereumService] Signature to verify: ${signature}`);
      
      // Format message exactly as backend
      const ethMessage = "\x19Ethereum Signed Message:\n" + message.length + message;
      console.debug(`[ethereumService] Formatted message for verification:`, {
        raw: ethMessage,
        bytes: Array.from(ethers.toUtf8Bytes(ethMessage)).map(b => b.toString(16).padStart(2, '0')).join('')
      });
      
      // Hash the message using keccak256
      const messageHash = ethers.keccak256(ethers.toUtf8Bytes(ethMessage));
      console.debug(`[ethereumService] Message hash for verification:`, {
        hash: messageHash,
        bytes: messageHash.slice(2)
      });
      
      // Remove 0x prefix if present
      const cleanSignature = signature.startsWith('0x') ? signature.slice(2) : signature;
      
      // Extract r, s, v from signature
      const sigBytes = this.hexToBytes(cleanSignature);
      const r = '0x' + this.bytesToHex(sigBytes.slice(0, 32));
      const s = '0x' + this.bytesToHex(sigBytes.slice(32, 64));
      const v = sigBytes[64];
      
      console.debug(`[ethereumService] Extracted signature components:`, {
        r,
        s,
        v,
        rBytes: this.bytesToHex(sigBytes.slice(0, 32)),
        sBytes: this.bytesToHex(sigBytes.slice(32, 64)),
        vByte: v.toString(16)
      });
      
      // Convert v back to ethers.js format (subtract 27)
      const recoveryId = v - 27;
      console.debug(`[ethereumService] Converted recovery ID for verification:`, recoveryId);
      
      // Recover address
      const recovered = ethers.recoverAddress(messageHash, { r, s, v: recoveryId });
      console.debug(`[ethereumService] Recovered address:`, {
        address: recovered,
        upperCase: recovered.toUpperCase(),
        originalMessage: message,
        messageHash,
        signature: cleanSignature
      });
      
      // Remove 0x prefix from recovered address for comparison if message doesn't have it
      const recoveredForComparison = message.startsWith('0x') ? recovered : recovered.slice(2);
      const isValid = recoveredForComparison.toLowerCase() === message.toLowerCase();
      
      console.debug(`[ethereumService] Verification comparison:`, {
        message,
        recovered,
        recoveredForComparison,
        isValid
      });
      
      return {
        isValid,
        recoveredAddress: recovered.toUpperCase()
      };
    } catch (error) {
      console.error('[ethereumService] Signature verification error:', error);
      return {
        isValid: false,
        recoveredAddress: ''
      };
    }
  }

  async generateEVMAddress(aptosAddress: string): Promise<string> {
    // For now, we'll use the same address format
    // In a real implementation, this would convert from Aptos to EVM format
    return aptosAddress;
  }
}

export default EthereumService.getInstance(); 
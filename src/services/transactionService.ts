import { Types } from "aptos";
import { WalletErrorType, WalletError } from "./walletService";
import walletService from "./walletService";
import podiumProtocol from "./podiumProtocol";

export interface TransactionMetadata {
  title: string;
  message: string;
  amount: string;
}

export interface TransactionStatus {
  success: boolean;
  hash: string;
  error?: WalletError;
}

class TransactionService {
  /**
   * Send a transaction with confirmation
   */
  async sendTransaction(params: {
    transaction: Types.TransactionPayload;
    chainId: string;
    metadata: TransactionMetadata;
  }): Promise<string> {
    try {
      const account = walletService.getAccount();
      if (!account) {
        throw {
          type: WalletErrorType.AUTHENTICATION_ERROR,
          message: "No wallet connected",
          code: 401,
        } as WalletError;
      }

      // Show transaction confirmation
      const confirmed = await this.showTransactionConfirmation(params.metadata);
      if (!confirmed) {
        throw {
          type: WalletErrorType.TRANSACTION_ERROR,
          message: "Transaction cancelled by user",
          code: 400,
        } as WalletError;
      }

      // Execute the transaction
      const hash = await podiumProtocol.executeTransaction(
        {
          type: walletService.getWalletType() || "web3auth",
          address: account.address().toString(),
        },
        params.transaction
      );

      return hash;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(txHash: string): Promise<TransactionStatus> {
    try {
      // This is a placeholder for actual transaction status checking
      // In a real implementation, you would check the transaction status on the blockchain
      return {
        success: true,
        hash: txHash,
      };
    } catch (error) {
      console.error("Error getting transaction status:", error);
      return {
        success: false,
        hash: txHash,
        error: {
          type: WalletErrorType.TRANSACTION_ERROR,
          message: "Failed to get transaction status",
          code: 500,
        },
      };
    }
  }

  /**
   * Show transaction confirmation dialog
   */
  private async showTransactionConfirmation(metadata: TransactionMetadata): Promise<boolean> {
    // This is a placeholder for the actual UI confirmation dialog
    // In a real implementation, you would show a modal or dialog to the user
    return window.confirm(
      `${metadata.title}\n\n${metadata.message}\n\nAmount: ${metadata.amount}\n\nDo you want to proceed?`
    );
  }

  /**
   * Handle insufficient funds error
   */
  async handleInsufficientFunds(address: string, chainId: string): Promise<void> {
    // This is a placeholder for handling insufficient funds
    // In a real implementation, you would show a UI to help the user get funds
    console.error(`Insufficient funds for address ${address} on chain ${chainId}`);
  }

  /**
   * Handle connection error
   */
  async handleConnectionError(provider: string): Promise<void> {
    // This is a placeholder for handling connection errors
    // In a real implementation, you would show a UI to help the user reconnect
    console.error(`Connection error with provider ${provider}`);
  }
}

export default new TransactionService(); 
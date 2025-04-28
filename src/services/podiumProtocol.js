import { AptosClient, AptosAccount, TxnBuilderTypes, BCS } from 'aptos';
import { Buffer } from 'buffer';
import { PODIUM_PROTOCOL_CONFIG } from '../config/config';

// Contract address
const CONTRACT_ADDRESS = PODIUM_PROTOCOL_CONFIG.CONTRACT_ADDRESS;

// Initialize Aptos client
const client = new AptosClient(PODIUM_PROTOCOL_CONFIG.RPC_URL);

/**
 * Service for interacting with the Podium Protocol smart contract
 */
class PodiumProtocolService {
  /**
   * Get the current price for a pass
   * @param {string} outpostAddress - The address of the outpost
   * @returns {Promise<number>} - The current price in OCTA units
   */
  async getPassPrice(outpostAddress) {
    try {
      const response = await client.view({
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::calculate_single_pass_price`,
        type_arguments: [],
        arguments: [outpostAddress]
      });
      
      return response[0];
    } catch (error) {
      console.error('Error getting pass price:', error);
      throw error;
    }
  }

  /**
   * Calculate the price to buy a pass with fees
   * @param {string} outpostAddress - The address of the outpost
   * @param {number} amount - The amount of passes to buy
   * @param {string|null} referrerAddress - Optional referrer address
   * @returns {Promise<{totalPrice: number, protocolFee: number, subjectFee: number, referrerFee: number}>}
   */
  async calculateBuyPriceWithFees(outpostAddress, amount, referrerAddress = null) {
    try {
      const response = await client.view({
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::calculate_buy_price_with_fees`,
        type_arguments: [],
        arguments: [
          outpostAddress,
          amount.toString(),
          referrerAddress ? [referrerAddress] : []
        ]
      });
      
      return {
        totalPrice: response[0],
        protocolFee: response[1],
        subjectFee: response[2],
        referrerFee: response[3]
      };
    } catch (error) {
      console.error('Error calculating buy price with fees:', error);
      throw error;
    }
  }

  /**
   * Buy a pass
   * @param {AptosAccount} account - The user's account
   * @param {string} outpostAddress - The address of the outpost
   * @param {number} amount - The amount of passes to buy
   * @param {string|null} referrerAddress - Optional referrer address
   * @returns {Promise<string>} - Transaction hash
   */
  async buyPass(account, outpostAddress, amount, referrerAddress = null) {
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::buy_pass`,
        type_arguments: [],
        arguments: [
          outpostAddress,
          amount.toString(),
          referrerAddress ? [referrerAddress] : []
        ]
      };

      const txnRequest = await client.generateTransaction(account.address(), payload);
      const signedTxn = await client.signTransaction(account, txnRequest);
      const txnResult = await client.submitTransaction(signedTxn);
      await client.waitForTransaction(txnResult.hash);
      
      return txnResult.hash;
    } catch (error) {
      console.error('Error buying pass:', error);
      throw error;
    }
  }

  /**
   * Calculate the price to sell a pass with fees
   * @param {string} outpostAddress - The address of the outpost
   * @param {number} amount - The amount of passes to sell
   * @returns {Promise<{totalPrice: number, protocolFee: number, subjectFee: number}>}
   */
  async calculateSellPriceWithFees(outpostAddress, amount) {
    try {
      const response = await client.view({
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::calculate_sell_price_with_fees`,
        type_arguments: [],
        arguments: [
          outpostAddress,
          amount.toString()
        ]
      });
      
      return {
        totalPrice: response[0],
        protocolFee: response[1],
        subjectFee: response[2]
      };
    } catch (error) {
      console.error('Error calculating sell price with fees:', error);
      throw error;
    }
  }

  /**
   * Sell a pass
   * @param {AptosAccount} account - The user's account
   * @param {string} outpostAddress - The address of the outpost
   * @param {number} amount - The amount of passes to sell
   * @returns {Promise<string>} - Transaction hash
   */
  async sellPass(account, outpostAddress, amount) {
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::sell_pass`,
        type_arguments: [],
        arguments: [
          outpostAddress,
          amount.toString()
        ]
      };

      const txnRequest = await client.generateTransaction(account.address(), payload);
      const signedTxn = await client.signTransaction(account, txnRequest);
      const txnResult = await client.submitTransaction(signedTxn);
      await client.waitForTransaction(txnResult.hash);
      
      return txnResult.hash;
    } catch (error) {
      console.error('Error selling pass:', error);
      throw error;
    }
  }

  /**
   * Get the balance of passes for a user
   * @param {string} userAddress - The user's address
   * @param {string} outpostAddress - The address of the outpost
   * @returns {Promise<number>} - The balance of passes
   */
  async getPassBalance(userAddress, outpostAddress) {
    try {
      const response = await client.view({
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::get_balance`,
        type_arguments: [],
        arguments: [userAddress, outpostAddress]
      });
      
      return response[0];
    } catch (error) {
      console.error('Error getting pass balance:', error);
      throw error;
    }
  }

  /**
   * Get the total supply of passes for an outpost
   * @param {string} outpostAddress - The address of the outpost
   * @returns {Promise<number>} - The total supply of passes
   */
  async getTotalSupply(outpostAddress) {
    try {
      const response = await client.view({
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::get_total_supply`,
        type_arguments: [],
        arguments: [outpostAddress]
      });
      
      return response[0];
    } catch (error) {
      console.error('Error getting total supply:', error);
      throw error;
    }
  }

  /**
   * Create a new outpost
   * @param {AptosAccount} account - The user's account
   * @param {string} name - The name of the outpost
   * @param {string} description - The description of the outpost
   * @param {string} uri - The URI for the outpost
   * @returns {Promise<string>} - Transaction hash
   */
  async createOutpost(account, name, description, uri) {
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::create_outpost_entry`,
        type_arguments: [],
        arguments: [name, description, uri]
      };

      const txnRequest = await client.generateTransaction(account.address(), payload);
      const signedTxn = await client.signTransaction(account, txnRequest);
      const txnResult = await client.submitTransaction(signedTxn);
      await client.waitForTransaction(txnResult.hash);
      
      return txnResult.hash;
    } catch (error) {
      console.error('Error creating outpost:', error);
      throw error;
    }
  }

  /**
   * Get outpost data
   * @param {string} outpostAddress - The address of the outpost
   * @returns {Promise<Object>} - The outpost data
   */
  async getOutpostData(outpostAddress) {
    try {
      // This is a simplified version - in a real implementation, you would need to
      // fetch the outpost data from the blockchain and parse it
      const response = await client.getAccountResource(
        CONTRACT_ADDRESS,
        `${CONTRACT_ADDRESS}::PodiumProtocol::OutpostData`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting outpost data:', error);
      throw error;
    }
  }

  /**
   * Create a subscription tier
   * @param {AptosAccount} account - The user's account
   * @param {string} outpostAddress - The address of the outpost
   * @param {string} tierName - The name of the tier
   * @param {number} price - The price of the tier in OCTA units
   * @param {number} duration - The duration of the tier in seconds
   * @returns {Promise<string>} - Transaction hash
   */
  async createSubscriptionTier(account, outpostAddress, tierName, price, duration) {
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::create_subscription_tier`,
        type_arguments: [],
        arguments: [
          outpostAddress,
          tierName,
          price.toString(),
          duration.toString()
        ]
      };

      const txnRequest = await client.generateTransaction(account.address(), payload);
      const signedTxn = await client.signTransaction(account, txnRequest);
      const txnResult = await client.submitTransaction(signedTxn);
      await client.waitForTransaction(txnResult.hash);
      
      return txnResult.hash;
    } catch (error) {
      console.error('Error creating subscription tier:', error);
      throw error;
    }
  }

  /**
   * Subscribe to an outpost
   * @param {AptosAccount} account - The user's account
   * @param {string} outpostAddress - The address of the outpost
   * @param {number} tierId - The ID of the tier
   * @param {string|null} referrerAddress - Optional referrer address
   * @returns {Promise<string>} - Transaction hash
   */
  async subscribe(account, outpostAddress, tierId, referrerAddress = null) {
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::subscribe`,
        type_arguments: [],
        arguments: [
          outpostAddress,
          tierId.toString(),
          referrerAddress ? [referrerAddress] : []
        ]
      };

      const txnRequest = await client.generateTransaction(account.address(), payload);
      const signedTxn = await client.signTransaction(account, txnRequest);
      const txnResult = await client.submitTransaction(signedTxn);
      await client.waitForTransaction(txnResult.hash);
      
      return txnResult.hash;
    } catch (error) {
      console.error('Error subscribing to outpost:', error);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   * @param {AptosAccount} account - The user's account
   * @param {string} outpostAddress - The address of the outpost
   * @returns {Promise<string>} - Transaction hash
   */
  async cancelSubscription(account, outpostAddress) {
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::cancel_subscription`,
        type_arguments: [],
        arguments: [outpostAddress]
      };

      const txnRequest = await client.generateTransaction(account.address(), payload);
      const signedTxn = await client.signTransaction(account, txnRequest);
      const txnResult = await client.submitTransaction(signedTxn);
      await client.waitForTransaction(txnResult.hash);
      
      return txnResult.hash;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * Get subscription details
   * @param {string} userAddress - The user's address
   * @param {string} outpostAddress - The address of the outpost
   * @returns {Promise<{tierId: number, startTime: number, endTime: number}>}
   */
  async getSubscription(userAddress, outpostAddress) {
    try {
      const response = await client.view({
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::get_subscription`,
        type_arguments: [],
        arguments: [userAddress, outpostAddress]
      });
      
      return {
        tierId: response[0],
        startTime: response[1],
        endTime: response[2]
      };
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw error;
    }
  }

  /**
   * Get subscription tier details
   * @param {string} outpostAddress - The address of the outpost
   * @param {number} tierId - The ID of the tier
   * @returns {Promise<{name: string, price: number, duration: number}>}
   */
  async getSubscriptionTierDetails(outpostAddress, tierId) {
    try {
      const response = await client.view({
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::get_subscription_tier_details`,
        type_arguments: [],
        arguments: [outpostAddress, tierId.toString()]
      });
      
      return {
        name: response[0],
        price: response[1],
        duration: response[2]
      };
    } catch (error) {
      console.error('Error getting subscription tier details:', error);
      throw error;
    }
  }

  /**
   * Get the number of tiers for an outpost
   * @param {string} outpostAddress - The address of the outpost
   * @returns {Promise<number>} - The number of tiers
   */
  async getTierCount(outpostAddress) {
    try {
      const response = await client.view({
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::get_tier_count`,
        type_arguments: [],
        arguments: [outpostAddress]
      });
      
      return response[0];
    } catch (error) {
      console.error('Error getting tier count:', error);
      throw error;
    }
  }

  /**
   * Toggle emergency pause for an outpost
   * @param {AptosAccount} account - The user's account
   * @param {string} outpostAddress - The address of the outpost
   * @returns {Promise<string>} - Transaction hash
   */
  async toggleEmergencyPause(account, outpostAddress) {
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::toggle_emergency_pause`,
        type_arguments: [],
        arguments: [outpostAddress]
      };

      const txnRequest = await client.generateTransaction(account.address(), payload);
      const signedTxn = await client.signTransaction(account, txnRequest);
      const txnResult = await client.submitTransaction(signedTxn);
      await client.waitForTransaction(txnResult.hash);
      
      return txnResult.hash;
    } catch (error) {
      console.error('Error toggling emergency pause:', error);
      throw error;
    }
  }

  /**
   * Check if an outpost is paused
   * @param {string} outpostAddress - The address of the outpost
   * @returns {Promise<boolean>} - Whether the outpost is paused
   */
  async isPaused(outpostAddress) {
    try {
      const response = await client.view({
        function: `${CONTRACT_ADDRESS}::PodiumProtocol::is_paused`,
        type_arguments: [],
        arguments: [outpostAddress]
      });
      
      return response[0];
    } catch (error) {
      console.error('Error checking if outpost is paused:', error);
      throw error;
    }
  }
}

export default new PodiumProtocolService(); 
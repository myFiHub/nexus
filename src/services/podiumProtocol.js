import { AptosClient } from 'aptos';
import { PODIUM_PROTOCOL_CONFIG } from '../config/config';

class PodiumProtocol {
  constructor() {
    this.client = new AptosClient(PODIUM_PROTOCOL_CONFIG.RPC_URL);
    this.moduleAddress = PODIUM_PROTOCOL_CONFIG.CONTRACT_ADDRESS;
    this.backupClients = PODIUM_PROTOCOL_CONFIG.PARTNER_RPC_URLS.map(url => new AptosClient(url));
  }

  // Helper function to get a working client
  async getWorkingClient() {
    try {
      await this.client.getLedgerInfo();
      return this.client;
    } catch (error) {
      // Try backup clients if main client fails
      for (const client of this.backupClients) {
        try {
          await client.getLedgerInfo();
          this.client = client; // Update main client to working one
          return client;
        } catch (e) {
          continue;
        }
      }
      throw new Error('No working RPC endpoints available');
    }
  }

  // Helper function to build transaction payload
  buildTransactionPayload(functionName, typeArgs = [], args = []) {
    return {
      function: `${this.moduleAddress}::PodiumProtocol::${functionName}`,
      type_arguments: typeArgs,
      arguments: args
    };
  }

  // Helper function to execute transaction
  async executeTransaction(signer, payload) {
    // We need to get a working client but don't use it directly in this method
    await this.getWorkingClient();
    
    try {
      let transaction;
      if (signer.type === 'web3auth') {
        // Handle Web3Auth transaction
        transaction = await this.buildWeb3AuthTransaction(signer, payload);
      } else {
        // Handle Nightly wallet transaction
        transaction = await window.movement.generateTransaction(signer.address, payload);
      }

      const pendingTxn = await window.movement.signAndSubmitTransaction(transaction);
      return pendingTxn.hash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  // Helper function for Web3Auth transactions
  async buildWeb3AuthTransaction(signer, payload) {
    const client = await this.getWorkingClient();

    const rawTxn = await client.generateTransaction(signer.address, payload);
    const bcsTxn = await client.signTransaction(signer, rawTxn);
    const pendingTxn = await client.submitTransaction(bcsTxn);
    
    return pendingTxn.hash;
  }

  // Get outpost details
  async getOutpost(outpostAddress) {
    const client = await this.getWorkingClient();
    try {
      const resource = await client.getAccountResource(
          outpostAddress,
        `${this.moduleAddress}::PodiumProtocol::OutpostData`
      );
      return this.parseOutpostData(resource.data);
    } catch (error) {
      console.error('Error fetching outpost:', error);
      throw error;
    }
  }

  // Get all outposts
  async getOutposts() {
    const client = await this.getWorkingClient();
    try {
      const resource = await client.getAccountResource(
        this.moduleAddress,
        `${this.moduleAddress}::PodiumProtocol::Config`
      );

      const outposts = resource.data.outposts;
      const outpostDetails = await Promise.all(
        outposts.map(address => this.getOutpost(address))
      );
      
      return outpostDetails;
    } catch (error) {
      console.error('Error fetching outposts:', error);
      throw error;
    }
  }

  // Get pass balance
  async getPassBalance(accountAddress, targetAddress) {
    const client = await this.getWorkingClient();
    try {
      const balance = await client.view({
        function: `${this.moduleAddress}::PodiumProtocol::get_balance`,
        type_arguments: [],
        arguments: [accountAddress, targetAddress]
      });
      return balance[0];
    } catch (error) {
      console.error('Error fetching pass balance:', error);
      return 0;
    }
  }

  // Get pass price
  async getPassPrice(targetAddress) {
    const client = await this.getWorkingClient();
    try {
      const supply = await this.getTotalSupply(targetAddress);
      const price = await client.view({
        function: `${this.moduleAddress}::PodiumProtocol::calculate_single_pass_price`,
        type_arguments: [],
        arguments: [supply]
      });
      return price[0];
    } catch (error) {
      console.error('Error fetching pass price:', error);
      throw error;
    }
  }

  // Get total supply
  async getTotalSupply(targetAddress) {
    const client = await this.getWorkingClient();
    try {
      const supply = await client.view({
        function: `${this.moduleAddress}::PodiumProtocol::get_total_supply`,
        type_arguments: [],
        arguments: [targetAddress]
      });
      return supply[0];
    } catch (error) {
      console.error('Error fetching total supply:', error);
      return 0;
    }
  }

  // Buy pass
  async buyPass(buyerAddress, targetAddress, amount, referrerAddress = null, wallet = null) {
    const payload = this.buildTransactionPayload(
      'buy_pass',
      [],
      [targetAddress, amount, referrerAddress]
    );
    
    return this.executeTransaction(
      wallet || { type: 'web3auth', address: buyerAddress },
      payload
    );
  }

  // Sell pass
  async sellPass(sellerAddress, targetAddress, amount, wallet = null) {
    const payload = this.buildTransactionPayload(
      'sell_pass',
      [],
      [targetAddress, amount]
    );
    
    return this.executeTransaction(
      wallet || { type: 'web3auth', address: sellerAddress },
      payload
    );
  }

  // Get subscription details
  async getSubscription(subscriberAddress, outpostAddress) {
    const client = await this.getWorkingClient();
    try {
      const subscription = await client.view({
        function: `${this.moduleAddress}::PodiumProtocol::get_subscription`,
        type_arguments: [],
        arguments: [subscriberAddress, outpostAddress]
      });
      return {
        tierId: subscription[0],
        startTime: subscription[1],
        endTime: subscription[2]
      };
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  // Get subscription tier details
  async getSubscriptionTier(outpostAddress, tierId) {
    const client = await this.getWorkingClient();
    try {
      const tier = await client.view({
        function: `${this.moduleAddress}::PodiumProtocol::get_subscription_tier_details`,
        type_arguments: [],
        arguments: [outpostAddress, tierId]
      });
      return {
        name: tier[0],
        price: tier[1],
        duration: tier[2]
      };
    } catch (error) {
      console.error('Error fetching subscription tier:', error);
      return null;
    }
  }

  // Subscribe to tier
  async subscribe(subscriberAddress, outpostAddress, tierId, referrerAddress = null, wallet = null) {
    const payload = this.buildTransactionPayload(
      'subscribe',
      [],
      [outpostAddress, tierId, referrerAddress]
    );
    
    return this.executeTransaction(
      wallet || { type: 'web3auth', address: subscriberAddress },
      payload
    );
  }

  // Cancel subscription
  async cancelSubscription(subscriberAddress, outpostAddress, wallet = null) {
    const payload = this.buildTransactionPayload(
      'cancel_subscription',
      [],
      [outpostAddress]
    );
      
    return this.executeTransaction(
      wallet || { type: 'web3auth', address: subscriberAddress },
      payload
    );
  }

  // Create outpost
  async createOutpost(creatorAddress, name, description, uri, wallet = null) {
    const payload = this.buildTransactionPayload(
      'create_outpost',
      [],
      [name, description, uri]
    );
    
    return this.executeTransaction(
      wallet || { type: 'web3auth', address: creatorAddress },
      payload
    );
  }

  // Helper function to parse outpost data
  parseOutpostData(data) {
    return {
      owner: data.owner,
      name: data.name,
      description: data.description,
      uri: data.uri,
      price: data.price,
      feeShare: data.fee_share,
      emergencyPause: data.emergency_pause,
      maxTiers: data.max_tiers,
      tierCount: data.tier_count
    };
  }

  // Get protocol fees
  async getProtocolFees() {
    const client = await this.getWorkingClient();
    try {
      const fees = await client.view({
        function: `${this.moduleAddress}::PodiumProtocol::get_protocol_fees`,
        type_arguments: [],
        arguments: []
      });
      return {
        subscriptionFee: fees[0],
        passFee: fees[1],
        referrerFee: fees[2]
      };
    } catch (error) {
      console.error('Error fetching protocol fees:', error);
      throw error;
    }
  }

  // Verify subscription
  async verifySubscription(subscriberAddress, outpostAddress, tierId) {
    const client = await this.getWorkingClient();
    try {
      const isValid = await client.view({
        function: `${this.moduleAddress}::PodiumProtocol::verify_subscription`,
        type_arguments: [],
        arguments: [subscriberAddress, outpostAddress, tierId]
      });
      return isValid[0];
    } catch (error) {
      console.error('Error verifying subscription:', error);
      return false;
    }
  }
}

export default new PodiumProtocol(); 
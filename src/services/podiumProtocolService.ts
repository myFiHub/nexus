// podiumProtocolService: Handles contract interactions for outposts, creators, passes, and subscriptions
// Add methods for fetching, trading, subscribing, etc.

import podiumProtocol from './podiumProtocol';

// Types for price calculations
interface PassPrices {
  singlePrice: number;
  buyPrice: number;
  sellPrice: number;
  buyPriceWithFees: number;
  sellPriceWithFees: number;
  fees: {
    buy: {
      protocol: number;
      subject: number;
      referral: number;
    };
    sell: {
      protocol: number;
      subject: number;
    };
  };
}

interface PassDetails {
  symbol: string;
  prices: PassPrices;
  supply: number;
}

// Debug logging utility
const debugLog = (section: string, message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.debug(`[${timestamp}] [podiumProtocolService:${section}] ${message}`, data || '');
};

const podiumProtocolService = {
  // Fetch outposts
  async fetchOutposts() {
    debugLog('fetchOutposts', 'Fetching outposts');
    // TODO: Implement contract call
    return [];
  },

  // Fetch creators
  async fetchCreators() {
    debugLog('fetchCreators', 'Fetching creators');
    // TODO: Implement contract call
    return [];
  },

  // Fetch outpost/creator detail
  async fetchDetail(targetType: 'outpost' | 'creator', address: string) {
    debugLog('fetchDetail', `Fetching ${targetType} detail`, { address });
    // TODO: Implement contract call
    return null;
  },

  // Buy/sell pass
  async tradePass(targetType: 'outpost' | 'creator', address: string, action: 'buy' | 'sell', amount: number) {
    debugLog('tradePass', `Trading pass: ${action}`, { targetType, address, amount });
    // TODO: Implement contract call
    return null;
  },

  // Subscribe to tier
  async subscribe(targetType: 'outpost' | 'creator', address: string, tierId: number) {
    debugLog('subscribe', `Subscribing to tier`, { targetType, address, tierId });
    // TODO: Implement contract call
    return null;
  },

  // Calculate pass prices for a given amount
  async calculatePassPrices(targetAddress: string, amount: number): Promise<PassPrices> {
    const startTime = performance.now();
    debugLog('calculatePassPrices', 'Starting price calculation', { targetAddress, amount });

    try {
      // Get current supply
      debugLog('calculatePassPrices', 'Fetching total supply');
      const supply = await podiumProtocol.getTotalSupply(targetAddress);
      debugLog('calculatePassPrices', 'Total supply fetched', { supply });
      
      // Get current price
      debugLog('calculatePassPrices', 'Fetching current price');
      const singlePrice = await podiumProtocol.getPassPrice(targetAddress);
      debugLog('calculatePassPrices', 'Current price fetched', { singlePrice });
      
      // Calculate buy/sell prices
      const buyPrice = singlePrice * amount;
      const sellPrice = singlePrice * amount;
      debugLog('calculatePassPrices', 'Basic prices calculated', { buyPrice, sellPrice });
      
      // Get protocol fees
      debugLog('calculatePassPrices', 'Fetching protocol fees');
      const { buyFee, sellFee, referralFee } = await podiumProtocol.getProtocolFees();
      debugLog('calculatePassPrices', 'Protocol fees fetched', { buyFee, sellFee, referralFee });
      
      // Calculate fees
      const protocolFee = Math.floor(buyPrice * buyFee / 10000);
      const subjectFee = Math.floor(buyPrice * sellFee / 10000);
      const referralFeeAmount = Math.floor(buyPrice * referralFee / 10000);
      debugLog('calculatePassPrices', 'Fees calculated', { protocolFee, subjectFee, referralFeeAmount });
      
      const buyPriceWithFees = buyPrice + protocolFee + subjectFee + referralFeeAmount;
      const sellPriceWithFees = sellPrice - protocolFee - subjectFee;
      debugLog('calculatePassPrices', 'Final prices with fees calculated', { buyPriceWithFees, sellPriceWithFees });

      const endTime = performance.now();
      debugLog('calculatePassPrices', `Price calculation completed in ${(endTime - startTime).toFixed(2)}ms`);

      return {
        singlePrice,
        buyPrice,
        sellPrice,
        buyPriceWithFees,
        sellPriceWithFees,
        fees: {
          buy: { protocol: protocolFee, subject: subjectFee, referral: referralFeeAmount },
          sell: { protocol: protocolFee, subject: subjectFee }
        }
      };
    } catch (error) {
      const endTime = performance.now();
      debugLog('calculatePassPrices', `Error in price calculation after ${(endTime - startTime).toFixed(2)}ms`, error);
      throw error;
    }
  },

  // Get complete pass details including symbol, prices, and supply
  async getPassDetails(targetAddress: string, amount: number): Promise<PassDetails> {
    const startTime = performance.now();
    debugLog('getPassDetails', 'Starting pass details fetch', { targetAddress, amount });

    try {
      // Get supply
      debugLog('getPassDetails', 'Fetching total supply');
      const supply = await podiumProtocol.getTotalSupply(targetAddress);
      debugLog('getPassDetails', 'Total supply fetched', { supply });
      
      // Calculate prices
      debugLog('getPassDetails', 'Calculating prices');
      const prices = await this.calculatePassPrices(targetAddress, amount);
      debugLog('getPassDetails', 'Prices calculated', { prices });
      
      // Get symbol
      debugLog('getPassDetails', 'Fetching asset symbol');
      let symbol;
      try {
        symbol = await podiumProtocol.getAssetSymbol(targetAddress);
        debugLog('getPassDetails', 'Asset symbol fetched', { symbol });
      } catch (error) {
        symbol = `P${targetAddress.slice(-6)}`;
        debugLog('getPassDetails', 'Using fallback symbol', { symbol, error });
      }
      
      const endTime = performance.now();
      debugLog('getPassDetails', `Pass details fetch completed in ${(endTime - startTime).toFixed(2)}ms`);

      return {
        symbol,
        prices,
        supply
      };
    } catch (error) {
      const endTime = performance.now();
      debugLog('getPassDetails', `Error in pass details fetch after ${(endTime - startTime).toFixed(2)}ms`, error);
      throw error;
    }
  },

  // Handle contract errors
  handleContractError(error: any): string {
    debugLog('handleContractError', 'Processing contract error', { error });
    
    if (error.code === 'EINVALID_AMOUNT') {
      return 'Amount must be positive';
    }
    if (error.code === 'EINSUFFICIENT_BALANCE') {
      return 'Insufficient balance';
    }
    if (error.code === 'EPASS_NOT_FOUND') {
      return 'Pass not found';
    }
    if (error.code === 'EEMERGENCY_PAUSE') {
      return 'This outpost is currently paused';
    }
    if (error.code === 'EINVALID_PRICE') {
      return 'Invalid price calculation';
    }
    return 'An error occurred';
  }
};

// List of official Podium team member Aptos addresses (update as needed)
export const podiumTeamMembersAptosAddresses: string[] = [
  // Official Podium team member address
  '0x18b91d9012b06fc7b9df498be6bfb6f75809febc421603683e4739967ca06743',
  '0x0e9583e041326faa8b549ad4b3deeb3ee935120fba63b093a46996a2f907b9f2'
];

/**
 * TEMPORARY: List of Podium Outpost addresses to check balances for.
 * Replace or extend this list as needed for local/dev testing.
 * When server or on-chain registry is available, this will be replaced.
 */
export const PODIUM_TARGET_ADDRESSES: string[] = [
  // Example outpost addresses (replace with real ones as needed)
  '0x18b91d9012b06fc7b9df498be6bfb6f75809febc421603683e4739967ca06743',
  '0x0e9583e041326faa8b549ad4b3deeb3ee935120fba63b093a46996a2f907b9f2',
  // Add more addresses here
];

/**
 * Checks if the user has a Podium Pass (ticket) from any official seller.
 * @param myAptosAddress The user's Aptos address
 * @returns Promise<boolean> true if user has a ticket, false otherwise
 */
export async function checkIfUserHasPodiumDefinedEntryTicket(myAptosAddress: string): Promise<boolean> {
  debugLog('checkIfUserHasPodiumDefinedEntryTicket', 'Checking for entry ticket', { myAptosAddress });
  
  const balancePromises = podiumTeamMembersAptosAddresses.map(
    (sellerAddress) => podiumProtocol.getPassBalance(myAptosAddress, sellerAddress)
  );
  
  debugLog('checkIfUserHasPodiumDefinedEntryTicket', 'Fetching balances from team members');
  const balances = await Promise.all(balancePromises);
  const hasTicket = balances.some(balance => balance && BigInt(balance) > 0n);
  
  debugLog('checkIfUserHasPodiumDefinedEntryTicket', 'Entry ticket check complete', { 
    myAptosAddress, 
    balances, 
    hasTicket 
  });
  
  return hasTicket;
}

export default podiumProtocolService; 
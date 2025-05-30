// podiumProtocolService: Handles contract interactions for outposts, creators, passes, and subscriptions
// Add methods for fetching, trading, subscribing, etc.

import podiumProtocol from './podiumProtocol';

const podiumProtocolService = {
  // Fetch outposts
  async fetchOutposts() {
    console.debug('[podiumProtocolService] fetchOutposts called');
    // TODO: Implement contract call
    return [];
  },

  // Fetch creators
  async fetchCreators() {
    console.debug('[podiumProtocolService] fetchCreators called');
    // TODO: Implement contract call
    return [];
  },

  // Fetch outpost/creator detail
  async fetchDetail(targetType: 'outpost' | 'creator', address: string) {
    console.debug('[podiumProtocolService] fetchDetail called', targetType, address);
    // TODO: Implement contract call
    return null;
  },

  // Buy/sell pass
  async tradePass(targetType: 'outpost' | 'creator', address: string, action: 'buy' | 'sell', amount: number) {
    console.debug('[podiumProtocolService] tradePass called', targetType, address, action, amount);
    // TODO: Implement contract call
    return null;
  },

  // Subscribe to tier
  async subscribe(targetType: 'outpost' | 'creator', address: string, tierId: number) {
    console.debug('[podiumProtocolService] subscribe called', targetType, address, tierId);
    // TODO: Implement contract call
    return null;
  },
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
  const balancePromises = podiumTeamMembersAptosAddresses.map(
    (sellerAddress) => podiumProtocol.getPassBalance(myAptosAddress, sellerAddress)
  );
  const balances = await Promise.all(balancePromises);
  const hasTicket = balances.some(balance => balance && BigInt(balance) > 0n);
  console.debug('[podiumProtocolService] checkIfUserHasPodiumDefinedEntryTicket:', { myAptosAddress, balances, hasTicket });
  return hasTicket;
}

export default podiumProtocolService; 
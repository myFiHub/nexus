/**
 * List of known MOVE coin types (native, FA, etc.) for Movement and Aptos.
 * Extend this list as new types are added to the ecosystem.
 */
export const MOVE_COIN_TYPES: string[] = [
  "0x1::aptos_coin::AptosCoin", // Aptos native
  "0x1::move::MOVE", // Movement native
  "0xa::move::MOVE", // FA MOVE (example, update as needed)
  "0x000000000000000000000000000000000000000000000000000000000000000a", // Movement mainnet MOVE
  // Add more as needed from bridge docs
];

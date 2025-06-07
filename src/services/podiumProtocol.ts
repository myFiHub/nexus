import { AptosClient, Types } from 'aptos';

export interface OutpostData {
  name: string;
  description: string;
  uri: string;
  creator: string;
  totalSupply: number;
  subscriptionTiers: {
    id: number;
    name: string;
    price: number;
    duration: number;
  }[];
}

export interface Subscription {
  tierId: number;
  startTime: number;
  endTime: number;
}

export interface SubscriptionTier {
  name: string;
  price: number;
  duration: number;
}

export interface PodiumProtocolInterface {
  getWorkingClient(): Promise<AptosClient>;
  buildTransactionPayload(functionName: string, typeArgs?: string[], args?: any[]): Types.TransactionPayload;
  executeTransaction(signer: any, payload: Types.TransactionPayload): Promise<string>;
  buildWeb3AuthTransaction(signer: any, payload: Types.TransactionPayload): Promise<string>;
  getOutpost(outpostAddress: string): Promise<OutpostData>;
  getOutposts(): Promise<OutpostData[]>;
  getPassBalance(accountAddress: string, targetAddress: string): Promise<number>;
  getPassPrice(targetAddress: string): Promise<number>;
  getTotalSupply(targetAddress: string): Promise<number>;
  buyPass(buyerAddress: string, targetAddress: string, amount: number, referrerAddress?: string | null, wallet?: any): Promise<string>;
  sellPass(sellerAddress: string, targetAddress: string, amount: number, wallet?: any): Promise<string>;
  getSubscription(subscriberAddress: string, outpostAddress: string): Promise<Subscription | null>;
  getSubscriptionTier(outpostAddress: string, tierId: number): Promise<SubscriptionTier | null>;
  subscribe(subscriberAddress: string, outpostAddress: string, tierId: number, referrerAddress?: string | null, wallet?: any): Promise<string>;
  cancelSubscription(subscriberAddress: string, outpostAddress: string, wallet?: any): Promise<string>;
  createOutpost(creatorAddress: string, name: string, description: string, uri: string, wallet?: any): Promise<string>;
  getProtocolFees(): Promise<{
    buyFee: number;
    sellFee: number;
    referralFee: number;
  }>;
  verifySubscription(subscriberAddress: string, outpostAddress: string, tierId: number): Promise<boolean>;
  getAssetSymbol(targetAddress: string): Promise<string>;
  
  // New price calculation methods
  calculate_single_pass_price(supply: number): Promise<number>;
  calculate_price(supply: number, amount: number, is_sell: boolean): Promise<number>;
  calculate_buy_price_with_fees(targetAddress: string, amount: number, referrer: string | null): Promise<[number, number, number, number]>;
  calculate_sell_price_with_fees(targetAddress: string, amount: number): Promise<[number, number, number]>;
}

// Import the JavaScript implementation
const podiumProtocol = require('./podiumProtocol.js').default as PodiumProtocolInterface;

export default podiumProtocol; 
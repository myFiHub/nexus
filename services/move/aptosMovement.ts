import { parseTokenUriToImageUrl } from "app/lib/parseTokenUriToImageUrl";
import { toast } from "app/lib/toast";
import axios from "axios";
import Decimal from "decimal.js-light";
import podiumApi from "../api";
import { User } from "../api/types";
import {
  BlockchainPassData,
  FungableTokenBalance,
  NFTResponse,
  ParsedPassData,
} from "./types";

import {
  Account,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";
import { AptosSignAndSubmitTransactionOutput } from "@aptos-labs/wallet-adapter-core";
import { isNetworkValidForExternalWalletLogin } from "app/components/Dialog/loginMethodSelect";
import { getStore } from "app/store";

// Placeholder for environment/config
const APTOS_INDEXER_URL =
  "https://indexer.mainnet.movementnetwork.xyz/v1/graphql";
const PODIUM_PROTOCOL_ADDRESS =
  process.env.NEXT_PUBLIC_PODIUM_PROTOCOL_ADDRESS || "";
const CHEER_BOO_ADDRESS = process.env.NEXT_PUBLIC_CHEER_BOO_ADDRESS || "";
const PODIUM_PROTOCOL_NAME = "PodiumProtocol";
const CHEER_BOO_NAME = "CheerOrBooPodium";

// Constants for decimal precision
const APTOS_DECIMALS = 8;
const APTOS_DECIMAL_FACTOR = new Decimal(10).pow(APTOS_DECIMALS);

/**
 * Converts a human-readable amount to Aptos on-chain amount (with 8 decimal places)
 * Uses Decimal.js for precise decimal arithmetic
 */
function doubleToBigIntMoveForAptos(amount: number | string): bigint {
  const decimalAmount = new Decimal(amount);
  const onChainAmount = decimalAmount.mul(APTOS_DECIMAL_FACTOR);
  return BigInt(onChainAmount.toFixed(0));
}

/**
 * Converts an Aptos on-chain amount (with 8 decimal places) to human-readable amount
 * Uses Decimal.js for precise decimal arithmetic
 */
function bigIntCoinToMoveOnAptos(amount: bigint | string): number {
  const decimalAmount = new Decimal(amount.toString());
  const humanAmount = decimalAmount.div(APTOS_DECIMAL_FACTOR);
  return humanAmount.toNumber();
}

/**
 * Formats a bigint amount to a human-readable string with proper decimal places
 */
function formatAptosAmount(
  amount: bigint | string,
  decimals: number = 4
): string {
  const humanAmount = bigIntCoinToMoveOnAptos(amount);
  return new Decimal(humanAmount).toFixed(decimals);
}

/**
 * Safely converts a string to a Decimal, handling invalid inputs
 */
function safeDecimal(value: any): Decimal {
  try {
    return new Decimal(value || 0);
  } catch {
    return new Decimal(0);
  }
}

class AptosMovement {
  private static _instance: AptosMovement;

  private _account?: Account;
  private _client: Aptos;
  private _connectedToExternalWallet: boolean = false;

  private constructor() {
    // Initialize new SDK client
    const config = new AptosConfig({
      network: Network.CUSTOM,
      fullnode: process.env.NEXT_PUBLIC_MOVEMENT_RPC_URL!,
    });
    this._client = new Aptos(config);
  }

  public static get instance() {
    if (!AptosMovement._instance) {
      AptosMovement._instance = new AptosMovement();
    }
    return AptosMovement._instance;
  }

  set connectedToExternalWallet(value: boolean) {
    this._connectedToExternalWallet = value;
  }

  get connectedToExternalWallet() {
    return this._connectedToExternalWallet;
  }

  get client() {
    return this._client;
  }

  setAccount(privateKey: string) {
    const privateKeyObj = new Ed25519PrivateKey(privateKey);
    const account = Account.fromPrivateKey({ privateKey: privateKeyObj });
    this._account = account;
  }

  clearAccount() {
    this._account = undefined;
    this._connectedToExternalWallet = false;
  }

  get account() {
    if (!this._account) throw new Error("Aptos account not set!");
    return this._account;
  }

  get address() {
    if (!this.connectedToExternalWallet) {
      return this.account.accountAddress.toString();
    }
    const store = getStore();
    const address = store
      .getState()
      .externalWallets.wallets.aptos.account?.address.toString();
    if (!address) throw new Error("Aptos address not set!");
    return address;
  }

  async isMyAccountActive() {
    try {
      // check if the account is active using the new SDK client
      await this._client.getAccountInfo({ accountAddress: this.address });
      return true;
    } catch {
      return false;
    }
  }

  async getBalanceFromIndexer(address: string): Promise<bigint> {
    try {
      const query = `
        query GetBalance($address: String!) {
          current_fungible_asset_balances(
            where: {
              owner_address: {_eq: $address},
              asset_type: {
                _in: [
                  "0x1::aptos_coin::AptosCoin",
                  "0x000000000000000000000000000000000000000000000000000000000000000a"
                ]
              }
             }
           ) {
            amount
          }
        }
      `;
      const response = await axios.post(
        APTOS_INDEXER_URL,
        {
          query,
          variables: { address },
        },
        { headers: { "Content-Type": "application/json" } }
      );
      const balances = response.data.data.current_fungible_asset_balances;
      if (balances && balances.length > 0) {
        // Use Decimal.js for precise balance calculation
        const totalBalance = balances.reduce(
          (sum: Decimal, b: any) => sum.plus(safeDecimal(b.amount)),
          new Decimal(0)
        );
        return BigInt(totalBalance.toFixed(0));
      }
      return BigInt(0);
    } catch (e) {
      toast.error("Error fetching balance from indexer: " + e);
      return BigInt(0);
    }
  }

  async getPasses(address?: string): Promise<BlockchainPassData[]> {
    const addressToUse = address || this.address;
    const query = `
      query GetPasses($address: String!) {
       current_fungible_asset_balances(
    where: {owner_address: {_eq: $address}, metadata: {project_uri: {_eq: "https://podium.fi/pass/"}}}
  ) {
    amount
    metadata {
      symbol
    }
  }
      }
    `;
    const response = await axios.post(
      APTOS_INDEXER_URL,
      { query, variables: { address: addressToUse } },
      { headers: { "Content-Type": "application/json" } }
    );
    const unParsed = response.data.data.current_fungible_asset_balances;
    const parsed: ParsedPassData[] = unParsed
      .map((item: any) => {
        // Use Decimal.js for precise amount conversion
        const rawAmount = safeDecimal(item.amount);
        const amount = bigIntCoinToMoveOnAptos(rawAmount.toString());
        return {
          amount,
          symbol: item.metadata.symbol,
          amountOwned: amount,
        };
      })
      .filter((item: ParsedPassData) => item.amountOwned > 0);

    const results = await Promise.allSettled(
      parsed.map((item: any) => podiumApi.getUserByPassSymbol(item.symbol))
    );

    const resultsToReturn: BlockchainPassData[] = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value) {
        const user: User = result.value!;
        resultsToReturn.push({
          userUuid: user.uuid,
          userImage: user.image,
          followedByMe: user.followed_by_me,
          userName: user.name,
          passSymbol: parsed[index].symbol,
          amountOwned: parsed[index].amountOwned,
          userAptosAddress: user.aptos_address,
        });
      } else {
        resultsToReturn.push({
          amountOwned: parsed[index].amountOwned,
          passSymbol: parsed[index].symbol,
        });
      }
    });

    return resultsToReturn;
  }

  async getMyNfts() {
    const query = `
query GetNFTs($address: String!) {
 current_token_ownerships_v2(
    where: {owner_address: {_eq: $address}, amount: {_gt: "0"}, current_token_data: {token_uri: {_neq: ""}}}
  ) {
    amount
    current_token_data {
      description
      token_name
      token_uri
      last_transaction_timestamp
    }
  }
}
  `;

    const address = this.address;
    const response = await axios.post(
      APTOS_INDEXER_URL,
      {
        query,
        variables: {
          address,
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // the tokenUri is the image url but it's in ipfs like :ipfs://Qm...
    // we need to convert it to a http url
    const nfts = response.data.data.current_token_ownerships_v2;
    const nftsWithImageUrl = nfts
      .map((nft: NFTResponse) => {
        return {
          ...nft,
          image_url: parseTokenUriToImageUrl(nft.current_token_data.token_uri),
        };
      })
      .filter((nft: NFTResponse) => {
        return nft.current_token_data.token_uri.includes("ipfs://");
      })
      .sort((a: NFTResponse, b: NFTResponse) => {
        return (
          new Date(b.current_token_data.last_transaction_timestamp).getTime() -
          new Date(a.current_token_data.last_transaction_timestamp).getTime()
        );
      });

    return nftsWithImageUrl;
  }

  async getUserTokenBalances(address: string): Promise<FungableTokenBalance[]> {
    const query = `
      query GetUserTokenBalances($address: String!) {
        current_fungible_asset_balances(
          where: { owner_address: { _eq: $address }, amount: { _gt: 0 } }
        ) {
          asset_type
          amount
          last_transaction_timestamp
          metadata {
            icon_uri
            maximum_v2
            project_uri
            supply_aggregator_table_handle_v1
            supply_aggregator_table_key_v1
            supply_v2
          }
        }
      }
    `;
    try {
      const response = await axios.post(
        APTOS_INDEXER_URL,
        {
          query,
          variables: { address },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // Process balances with Decimal.js for precision
      const balances = response.data.data.current_fungible_asset_balances;
      return balances.map((balance: any) => ({
        ...balance,
        // Ensure amount is properly handled as a string for precision
        amount: safeDecimal(balance.amount).toString(),
      }));
    } catch (error) {
      toast.error("Error fetching token balances from indexer: " + error);
      return [];
    }
  }

  async getAddressBalance(address: string): Promise<bigint> {
    return this.getBalanceFromIndexer(address);
  }

  async balance() {
    const exists = await this.isMyAccountActive();
    if (!exists) return BigInt(0);
    return this.getAddressBalance(this.address);
  }

  /**
   * Get formatted balance as a string with specified decimal places
   */
  async getFormattedBalance(decimals: number = 4): Promise<string> {
    const balance = await this.balance();
    return formatAptosAmount(balance, decimals);
  }

  /**
   * Check if account has sufficient balance for a given amount
   */
  async hasSufficientBalance(amount: number | string): Promise<boolean> {
    const balance = await this.balance();
    const requiredAmount = doubleToBigIntMoveForAptos(amount);
    return balance >= requiredAmount;
  }

  /**
   * Get remaining balance after deducting a given amount
   */
  async getRemainingBalance(amount: number | string): Promise<bigint> {
    const balance = await this.balance();
    const deductAmount = doubleToBigIntMoveForAptos(amount);
    const remaining = new Decimal(balance.toString()).minus(
      deductAmount.toString()
    );
    return BigInt(remaining.gte(0) ? remaining.toFixed(0) : "0");
  }

  async cheerBoo(opts: {
    target: string;
    receiverAddresses: string[];
    amount: number;
    cheer: boolean;
    outpostId: string;
  }): Promise<[boolean | null, string | null]> {
    try {
      // Use improved balance checking with Decimal.js precision
      if (!(await this.hasSufficientBalance(opts.amount))) {
        const formattedBalance = await this.getFormattedBalance();
        toast.error(
          `Insufficient balance. Current balance: ${formattedBalance} APT`
        );
        return [false, "Insufficient balance"];
      }

      const amountToSend = doubleToBigIntMoveForAptos(opts.amount).toString();
      const isSelfReaction = !opts.receiverAddresses.includes(opts.target);
      const isBoo = !opts.cheer;
      let percentage = 50;
      if (isSelfReaction) percentage = 0;
      if (isBoo && !isSelfReaction) percentage = 30;
      if (opts.receiverAddresses.length === 1 && isSelfReaction)
        percentage = 100;
      if (opts.receiverAddresses.length === 2 && !isSelfReaction)
        percentage = 100;
      const data: any = {
        function: `${CHEER_BOO_ADDRESS}::${CHEER_BOO_NAME}::cheer_or_boo`,
        functionArguments: [
          opts.target,
          opts.receiverAddresses,
          opts.cheer,
          amountToSend,
          percentage.toString(),
          opts.outpostId,
        ],
      };

      let hash = "";

      if (this._connectedToExternalWallet) {
        const result = await this._handleExternalWalletTransaction(data);
        if (result) {
          hash = result.hash;
        }
      } else {
        // Build transaction using new SDK
        const transaction = await this._client.transaction.build.simple({
          sender: this.account.accountAddress,
          data,
        });
        const pendingTransaction = await this._client.signAndSubmitTransaction({
          signer: this.account,
          transaction,
        });
        hash = pendingTransaction.hash;
      }

      // Wait for transaction to be committed
      const transactionResponse = await this._client.waitForTransaction({
        transactionHash: hash,
        options: {
          checkSuccess: true,
        },
      });

      return [true, transactionResponse.hash];
    } catch (e: any) {
      toast.error("Error submitting transaction: " + e);
      return [false, e.toString()];
    }
  }

  async getPodiumPassPrice(opts: {
    sellerAddress: string;
    numberOfTickets?: number;
  }): Promise<number | null> {
    try {
      const response = await this._client.view({
        payload: {
          function: `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::calculate_buy_price_with_fees`,
          typeArguments: [],
          functionArguments: [
            opts.sellerAddress,
            (opts.numberOfTickets || 1).toString(),
            this.address,
          ],
        },
      });
      const pString = response[0]?.toString();
      if (!pString) return null;
      const bigIntPrice = BigInt(pString);
      return bigIntCoinToMoveOnAptos(bigIntPrice);
    } catch (e: any) {
      toast.error(e.toString().replace("AxiosError: ", ""));
      return null;
    }
  }

  async getMyBalanceOnPodiumPass(opts: {
    myAddress?: string;
    sellerAddress: string;
  }): Promise<bigint | null> {
    try {
      const response = await this._client.view({
        payload: {
          function: `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::get_balance`,
          typeArguments: [],
          functionArguments: [
            opts.myAddress || this.address,
            opts.sellerAddress,
          ],
        },
      });
      const pString = response[0]?.toString();
      if (!pString) return null;
      const bigIntAmount = BigInt(pString);
      return bigIntAmount;
    } catch (e: any) {
      toast.error(e.toString().replace("AxiosError:", ""));
      return null;
    }
  }

  async buyPodiumPassFromUser(opts: {
    sellerAddress: string;
    sellerName: string;
    sellerUuid: string;
    referrer?: string;
    numberOfTickets?: number;
  }): Promise<[boolean | null, string | null]> {
    try {
      const isMyAccountActive = await this.isMyAccountActive();
      if (!isMyAccountActive) return [false, "Account not active"];

      // Get the price for the pass
      const passPrice = await this.getPodiumPassPrice({
        sellerAddress: opts.sellerAddress,
        numberOfTickets: opts.numberOfTickets,
      });

      if (passPrice === null) {
        toast.error("Unable to get pass price");
        return [false, "Unable to get pass price"];
      }

      // Check if user has sufficient balance for the pass
      if (!(await this.hasSufficientBalance(passPrice))) {
        const formattedBalance = await this.getFormattedBalance();
        toast.error(
          `Insufficient balance. Required: ${passPrice} APT, Current: ${formattedBalance} APT`
        );
        return [false, "Insufficient balance"];
      }

      const referrerAddress = opts.referrer || "";

      const data: any = {
        function: `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::buy_pass`,
        functionArguments: [
          opts.sellerAddress,
          (opts.numberOfTickets || 1).toString(),
          referrerAddress,
        ],
      };

      let hash = "";

      if (this._connectedToExternalWallet) {
        const result = await this._handleExternalWalletTransaction(data);
        if (result) {
          hash = result.hash;
        }
      } else {
        // Build transaction using new SDK
        const transaction = await this._client.transaction.build.simple({
          sender: this.account.accountAddress,
          data,
        });

        const pendingTransaction = await this._client.signAndSubmitTransaction({
          signer: this.account,
          transaction,
        });
        hash = pendingTransaction.hash;
      }

      // Wait for transaction to be committed
      const transactionResponse = await this._client.waitForTransaction({
        transactionHash: hash,
        options: {
          checkSuccess: true,
        },
      });

      return [true, transactionResponse.hash];
    } catch (e: any) {
      toast.error("Error buying Pass: " + e.toString());
      return [false, e.toString().replace("AxiosError:", "")];
    }
  }

  async getSellPriceForPodiumPass(opts: {
    sellerAddress: string;
    numberOfTickets?: number;
  }): Promise<bigint | null> {
    try {
      const response = await this._client.view({
        payload: {
          function: `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::calculate_sell_price_with_fees`,
          typeArguments: [],
          functionArguments: [
            opts.sellerAddress,
            (opts.numberOfTickets || 1).toString(),
          ],
        },
      });
      const pString = response[0]?.toString();
      if (!pString) return null;
      return BigInt(pString);
    } catch (e: any) {
      toast.error(e.toString().replace("AxiosError:", ""));
      return null;
    }
  }

  async sellPodiumPass(opts: {
    sellerAddress: string;
    sellerUuid: string;
    numberOfTickets: number;
  }): Promise<[boolean | null, string | null]> {
    try {
      const data: any = {
        function: `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::sell_pass`,
        functionArguments: [
          opts.sellerAddress,
          opts.numberOfTickets.toString(),
        ],
      };

      let hash = "";

      if (this._connectedToExternalWallet) {
        const result = await this._handleExternalWalletTransaction(data);
        if (result) {
          hash = result.hash;
        }
      } else {
        // Build transaction using new SDK
        const transaction = await this._client.transaction.build.simple({
          sender: this.account.accountAddress,
          data,
        });

        const pendingTransaction = await this._client.signAndSubmitTransaction({
          signer: this.account,
          transaction,
        });
        hash = pendingTransaction.hash;
      }

      // Wait for transaction to be committed
      const transactionResponse = await this._client.waitForTransaction({
        transactionHash: hash,
        options: {
          checkSuccess: true,
        },
      });

      return [true, transactionResponse.hash];
    } catch (e: any) {
      toast.error("Error selling Pass: " + e.toString());
      return [false, e.toString().replace("AxiosError:", "")];
    }
  }

  /**
   * Handles external wallet transaction signing and validation
   */
  private async _handleExternalWalletTransaction(
    data: any
  ): Promise<AptosSignAndSubmitTransactionOutput | undefined> {
    const store = getStore();
    const signAndSubmitTransaction =
      store.getState().externalWallets.wallets.aptos.signAndSubmitTransaction;

    const account = store.getState().externalWallets.wallets.aptos.account;
    const address = account?.address.toString();
    const network = store.getState().externalWallets.wallets.aptos.network;
    if (!address || !network) {
      toast.error("Connect your wallet and try again");
      return undefined;
    }
    if (!isNetworkValidForExternalWalletLogin(network)) {
      toast.error(
        "Please switch to the Movement Mainnet network on your wallet and try again"
      );
      return undefined;
    }
    if (signAndSubmitTransaction) {
      try {
        const result = await signAndSubmitTransaction({
          data,
        });
        return result;
      } catch (e: any) {
        console.error("e", e);
        if (
          e.message?.includes("rejected") ||
          e.toString().includes("rejected")
        ) {
          toast.error("Transaction rejected");
          return undefined;
        }
        toast.error(e.toString());
        return undefined;
      }
    }
    return undefined;
  }
  async sendMoveToAddress({
    targetAddress,
    amount,
  }: {
    targetAddress: string;
    amount: number;
  }): Promise<[boolean | null, string | null]> {
    try {
      // Check if account is active
      if (!(await this.isMyAccountActive())) {
        toast.error("Account is not active");
        return [false, "Account is not active"];
      }

      // Check if target address is valid
      if (!targetAddress || targetAddress.length !== 66) {
        toast.error("Invalid target address");
        return [false, "Invalid target address"];
      }

      // Check if amount is positive
      if (amount <= 0) {
        toast.error("Amount must be greater than 0");
        return [false, "Amount must be greater than 0"];
      }

      // Check if user has sufficient balance
      if (!(await this.hasSufficientBalance(amount))) {
        const formattedBalance = await this.getFormattedBalance();
        toast.error(
          `Insufficient balance. Current balance: ${formattedBalance} MOVE`
        );
        return [false, "Insufficient balance"];
      }

      // Convert amount to on-chain format (8 decimal places)
      const amountToSend = doubleToBigIntMoveForAptos(amount).toString();

      // Build transaction data for native Aptos transfer
      const data: any = {
        function: "0x1::aptos_account::transfer",
        // function: "0x1::coin::transfer",
        // typeArguments: [APTOS_COIN],
        functionArguments: [targetAddress, amountToSend],
      };

      let hash = "";

      if (this._connectedToExternalWallet) {
        const result = await this._handleExternalWalletTransaction(data);
        if (result) {
          hash = result.hash;
        } else {
          return [false, "Transaction failed"];
        }
      } else {
        // Build transaction using new SDK
        const transaction = await this._client.transaction.build.simple({
          sender: this.account.accountAddress,
          data,
        });

        // calculate tx fee

        const pendingTransaction = await this._client.signAndSubmitTransaction({
          signer: this.account,
          transaction,
        });
        hash = pendingTransaction.hash;
      }

      // Wait for transaction to be committed
      const transactionResponse = await this._client.waitForTransaction({
        transactionHash: hash,
        options: {
          checkSuccess: true,
        },
      });

      toast.success(`Successfully sent ${amount} MOVE to ${targetAddress}`);
      return [true, transactionResponse.hash];
    } catch (e: any) {
      const errorMessage = e.toString().replace("AxiosError:", "");
      toast.error("Error transferring MOVE: " + errorMessage);
      return [false, errorMessage];
    }
  }
}

export const movementService = AptosMovement.instance;

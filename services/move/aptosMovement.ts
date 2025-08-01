import { parseTokenUriToImageUrl } from "app/lib/parseTokenUriToImageUrl";
import { toast } from "app/lib/toast";
import { AptosAccount, AptosClient, CoinClient, Types } from "aptos";
import axios from "axios";
import podiumApi from "../api";
import { User } from "../api/types";
import {
  BlockchainPassData,
  FungableTokenBalance,
  NFTResponse,
  ParsedPassData,
} from "./types";

// Placeholder for environment/config
const APTOS_INDEXER_URL =
  "https://indexer.mainnet.movementnetwork.xyz/v1/graphql";
const PODIUM_PROTOCOL_ADDRESS =
  process.env.NEXT_PUBLIC_PODIUM_PROTOCOL_ADDRESS || "";
const CHEER_BOO_ADDRESS = process.env.NEXT_PUBLIC_CHEER_BOO_ADDRESS || "";
const PODIUM_PROTOCOL_NAME = "PodiumProtocol";
const CHEER_BOO_NAME = "CheerOrBooPodium";

function doubleToBigIntMoveForAptos(amount: number): bigint {
  // Implement conversion logic as needed
  return BigInt(Math.floor(amount * 1e8));
}
function bigIntCoinToMoveOnAptos(amount: bigint): number {
  // Implement conversion logic as needed
  return Number(amount) / 1e8;
}

class AptosMovement {
  private static _instance: AptosMovement;
  private _client: AptosClient;
  private _coinClient: CoinClient;
  private _account?: AptosAccount;

  private constructor() {
    this._client = new AptosClient(process.env.NEXT_PUBLIC_MOVEMENT_RPC_URL!);
    this._coinClient = new CoinClient(this._client);
  }

  public static get instance() {
    if (!AptosMovement._instance) {
      AptosMovement._instance = new AptosMovement();
    }
    return AptosMovement._instance;
  }

  get client() {
    return this._client;
  }

  get coinClient() {
    return this._coinClient;
  }

  setAccount(account: AptosAccount) {
    this._account = account;
  }

  get account() {
    if (!this._account) throw new Error("Aptos account not set!");
    return this._account;
  }

  get address() {
    return this.account.address().toString();
  }

  async sequenceNumber() {
    const accountInfo = await this._client.getAccount(this.address);
    return Number(accountInfo.sequence_number);
  }

  async isMyAccountActive() {
    try {
      await this._client.getAccount(this.address);
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
        return balances.reduce(
          (sum: bigint, b: any) => sum + BigInt(b.amount),
          BigInt(0)
        );
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
        const amount = bigIntCoinToMoveOnAptos(BigInt(item.amount));
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

    console.log({ results });
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
      return response.data.data.current_fungible_asset_balances;
    } catch (error) {
      toast.error("Error fetching token balances from indexer: " + error);
      return [];
    }
  }

  // Get total supply
  async getTotalSupply(targetAddress: string): Promise<number> {
    try {
      const supply = await this.client.view({
        function: `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::get_total_supply`,
        type_arguments: [],
        arguments: [targetAddress],
      });
      return supply[0] as number;
    } catch (error) {
      console.error("Error fetching total supply:", error);
      return 0;
    }
  }

  async getAddressBalance(address: string): Promise<bigint> {
    return this.getBalanceFromIndexer(address);
  }

  // Get protocol fees
  async getProtocolFees() {
    try {
      const fees = await this.client.view({
        function: `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::get_protocol_fees`,
        type_arguments: [],
        arguments: [],
      });
      return {
        subscriptionFee: fees[0],
        passFee: fees[1],
        referrerFee: fees[2],
      };
    } catch (error) {
      console.error("Error fetching protocol fees:", error);
      throw error;
    }
  }

  async balance() {
    const exists = await this.isMyAccountActive();
    if (!exists) return BigInt(0);
    return this.getAddressBalance(this.address);
  }

  async cheerBoo(opts: {
    target: string;
    receiverAddresses: string[];
    amount: number;
    cheer: boolean;
    outpostId: string;
  }): Promise<[boolean | null, string | null]> {
    try {
      const b = await this.balance();
      if (b < doubleToBigIntMoveForAptos(opts.amount)) {
        toast.error("Insufficient balance");
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
      const payload: Types.EntryFunctionPayload = {
        function: `${CHEER_BOO_ADDRESS}::${CHEER_BOO_NAME}::cheer_or_boo`,
        type_arguments: [],
        arguments: [
          opts.target,
          opts.receiverAddresses,
          opts.cheer,
          amountToSend,
          percentage.toString(),
          opts.outpostId,
        ],
      };
      const txnRequest = await this._client.generateTransaction(
        this.account.address(),
        payload
      );
      const signedTxn = await this._client.signTransaction(
        this.account,
        txnRequest
      );
      const res = await this._client.submitSignedBCSTransaction(signedTxn);
      const hash = res.hash;
      await this._client.waitForTransaction(hash, { checkSuccess: true });
      return [true, hash];
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
        function: `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::calculate_buy_price_with_fees`,
        type_arguments: [],
        arguments: [
          opts.sellerAddress,
          (opts.numberOfTickets || 1).toString(),
          { vec: [] },
        ],
      });
      const pString = response[0].toString();
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
        function: `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::get_balance`,
        type_arguments: [],
        arguments: [opts.myAddress || this.address, opts.sellerAddress],
      });
      const pString = response[0].toString();
      const bigIntAmount = BigInt(pString);
      return bigIntAmount;
    } catch (e: any) {
      toast.error(e.toString().replace("AxiosError:", ""));
      return null;
    }
  }

  listenToEvents(
    opts: { address: string; eventHandle: string; fieldName: string },
    cb: (events: any) => void
  ) {
    // Poll every 5 seconds
    setInterval(async () => {
      try {
        // You may need to adjust this to your event API
        const events = await this._client.getEventsByEventHandle(
          opts.address,
          opts.eventHandle,
          opts.fieldName,
          { limit: 10 }
        );
        cb(events);
      } catch (e: any) {
        toast.error("Error fetching events: " + e.toString());
      }
    }, 5000);
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
      const referrerAddress = opts.referrer || "";

      const payload: Types.EntryFunctionPayload = {
        function: `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::buy_pass`,
        type_arguments: [],
        arguments: [
          opts.sellerAddress,
          (opts.numberOfTickets || 1).toString(),
          referrerAddress,
        ],
      };
      const txnRequest = await this._client.generateTransaction(
        this.account.address(),
        payload
      );
      const signedTxn = await this._client.signTransaction(
        this.account,
        txnRequest
      );
      const res = await this._client.submitSignedBCSTransaction(signedTxn);
      const hash = res.hash;
      await this._client.waitForTransaction(hash, { checkSuccess: true });

      return [true, hash];
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
        function: `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::calculate_sell_price_with_fees`,
        type_arguments: [],
        arguments: [opts.sellerAddress, (opts.numberOfTickets || 1).toString()],
      });
      return BigInt(response[0].toString());
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
      const payload: Types.EntryFunctionPayload = {
        function: `${PODIUM_PROTOCOL_ADDRESS}::${PODIUM_PROTOCOL_NAME}::sell_pass`,
        type_arguments: [],
        arguments: [opts.sellerAddress, , opts.numberOfTickets.toString()],
      };
      const txnRequest = await this._client.generateTransaction(
        this.account.address(),
        payload
      );
      const signedTxn = await this._client.signTransaction(
        this.account,
        txnRequest
      );
      const res = await this._client.submitSignedBCSTransaction(signedTxn);
      const hash = res.hash;
      await this._client.waitForTransaction(hash, { checkSuccess: true });
      // Optionally call your backend here
      return [true, hash];
    } catch (e: any) {
      toast.error("Error selling Pass: " + e.toString());
      return [false, e.toString().replace("AxiosError:", "")];
    }
  }
}

export const movementService = AptosMovement.instance;

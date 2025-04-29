declare module 'aptos' {
  export class AptosAccount {
    constructor(privateKeyBytes?: Uint8Array);
    address(): { toString(): string };
    signingKey: {
      secretKey: Uint8Array;
      publicKey: Uint8Array;
    };
  }

  export class AptosClient {
    constructor(nodeUrl: string);
  }

  export namespace Types {
    export interface TransactionPayload {
      function: string;
      type_arguments: string[];
      arguments: any[];
    }
  }
} 
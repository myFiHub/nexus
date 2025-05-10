@aptos-labs/ts-sdk - v1.39.0
TypeScript SDK for Aptos
License Discord NPM Package Version Node Version NPM bundle size NPM Package Downloads

The TypeScript SDK allows you to connect, explore, and interact with the Aptos blockchain. You can use it to request data, send transactions, set up test environments, and more!

Learn How To Use The TypeScript SDK
Quickstart
Tutorials
Examples
Reference Docs (For looking up specific functions)
Installation
For use in Node.js or a web application
Install with your favorite package manager such as npm, yarn, or pnpm:

pnpm install @aptos-labs/ts-sdk
Copy
For use in a browser (<= version 1.9.1 only)
You can add the SDK to your web application using a script tag:

<script src="https://unpkg.com/@aptos-labs/ts-sdk/dist/browser/index.global.js"></script>
Copy
Then, the SDK can be accessed through window.aptosSDK.

Usage
Create an Aptos client in order to access the SDK's functionality.

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk"

// You can use AptosConfig to choose which network to connect to
const config = new AptosConfig({ network: Network.TESTNET });
// Aptos is the main entrypoint for all functions
const aptos = new Aptos(config);
Copy
Reading Data From Onchain (Guide)
const fund = await aptos.getAccountInfo({ accountAddress: "0x123" });
const modules = await aptos.getAccountModules({ accountAddress: "0x123" });
const tokens = await aptos.getAccountOwnedTokens({ accountAddress: "0x123" });
Copy
Account management (default to Ed25519)
Note: We introduce a Single Sender authentication (as introduced in AIP-55). Generating an account defaults to Legacy Ed25519 authentication with the option to use the Single Sender unified authentication.

Generate new keys
const account = Account.generate(); // defaults to Legacy Ed25519
const account = Account.generate({ scheme: SigningSchemeInput.Secp256k1Ecdsa }); // Single Sender Secp256k1
const account = Account.generate({ scheme: SigningSchemeInput.Ed25519, legacy: false }); // Single Sender Ed25519
Copy
Derive from private key
// Create a private key instance for Ed25519 scheme
const privateKey = new Ed25519PrivateKey("myEd25519privatekeystring");
// Or for Secp256k1 scheme
const privateKey = new Secp256k1PrivateKey("mySecp256k1privatekeystring");

// Derive an account from private key

// This is used as a local calculation and therefore is used to instantiate an `Account`
// that has not had its authentication key rotated
const account = await Account.fromPrivateKey({ privateKey });

// Also, can use this function that resolves the provided private key type and derives the public key from it
// to support key rotation and differentiation between Legacy Ed25519 and Unified authentications
const aptos = new Aptos();
const account = await aptos.deriveAccountFromPrivateKey({ privateKey });
Copy
Derive from private key and address
// Create a private key instance for Ed25519 scheme
const privateKey = new Ed25519PrivateKey("myEd25519privatekeystring");
// Or for Secp256k1 scheme
const privateKey = new Secp256k1PrivateKey("mySecp256k1privatekeystring");

// Derive an account from private key and address

// create an AccountAddress instance from the account address string
const address = AccountAddress.from("myaccountaddressstring");
// Derive an account from private key and address
const account = await Account.fromPrivateKeyAndAddress({ privateKey, address });
Copy
Derive from path
const path = "m/44'/637'/0'/0'/1";
const mnemonic = "various float stumble...";
const account = Account.fromDerivationPath({ path, mnemonic });
Copy
Submit transaction (Tutorial)
/**
 * This example shows how to use the Aptos SDK to send a transaction.
 * Don't forget to install @aptos-labs/ts-sdk before running this example!
 */
 
import {
    Account,
    Aptos,
    AptosConfig,
    Network,
} from "@aptos-labs/ts-sdk";
 
async function example() {
    console.log("This example will create two accounts (Alice and Bob) and send a transaction transferring APT to Bob's account.");
 
    // 0. Setup the client and test accounts
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
 
    let alice = Account.generate();
    let bob = Account.generate();
 
    console.log("=== Addresses ===\n");
    console.log(`Alice's address is: ${alice.accountAddress}`);
    console.log(`Bob's address is: ${bob.accountAddress}`);
 
    console.log("\n=== Funding accounts ===\n");
    await aptos.fundAccount({
        accountAddress: alice.accountAddress,
        amount: 100_000_000,
    });  
    await aptos.fundAccount({
        accountAddress: bob.accountAddress,
        amount: 100,
    });
    console.log("Funded Alice and Bob's accounts!")
 
    // 1. Build
    console.log("\n=== 1. Building the transaction ===\n");
    const transaction = await aptos.transaction.build.simple({
        sender: alice.accountAddress,
        data: {
        // All transactions on Aptos are implemented via smart contracts.
        function: "0x1::aptos_account::transfer",
        functionArguments: [bob.accountAddress, 100],
        },
    });
    console.log("Built the transaction!")
 
    // 2. Simulate (Optional)
    console.log("\n === 2. Simulating Response (Optional) === \n")
    const [userTransactionResponse] = await aptos.transaction.simulate.simple({
        signerPublicKey: alice.publicKey,
        transaction,
    });
    console.log(userTransactionResponse)
 
    // 3. Sign
    console.log("\n=== 3. Signing transaction ===\n");
    const senderAuthenticator = aptos.transaction.sign({
        signer: alice,
        transaction,
    });
    console.log("Signed the transaction!")
 
    // 4. Submit
    console.log("\n=== 4. Submitting transaction ===\n");
    const submittedTransaction = await aptos.transaction.submit.simple({
        transaction,
        senderAuthenticator,
    });
 
    console.log(`Submitted transaction hash: ${submittedTransaction.hash}`);
 
    // 5. Wait for results
    console.log("\n=== 5. Waiting for result of transaction ===\n");
    const executedTransaction = await aptos.waitForTransaction({ transactionHash: submittedTransaction.hash });
    console.log(executedTransaction)
};
 
example();
Copy
Troubleshooting
If you see an import error when you do this:

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
Copy
It could be that your tsconfig.json is not using node. Make sure your moduleResolution in the tsconfig.json is set to node instead of bundler.

Contributing
If you found a bug or would like to request a feature, please file an issue. If, based on the discussion on an issue, you would like to offer a code change, please make a pull request. If neither of these describes what you would like to contribute, check out the contributing guide.

Running unit tests
To run a unit test in this repo, for example, the keyless end-to-end unit test in tests/e2e/api/keyless.test.ts:

pnpm jest keyless.test.ts
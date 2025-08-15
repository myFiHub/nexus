import { Ed25519PublicKey, Ed25519Signature } from "@aptos-labs/ts-sdk";
import { ExternalWalletsState } from "app/containers/_externalWallets/slice";
import { getStore } from "app/store";
import { ethers } from "ethers";
import { toast } from "sonner";

export const signMessage = async ({
  privateKey,
  message,
}: {
  privateKey: string;
  message: string;
}) => {
  const wallet = new ethers.Wallet(privateKey);
  const signature = await wallet.signMessage(message);
  return signature;
};

export const signMessageWithTimestamp = async ({
  privateKey,
  message,
}: {
  privateKey: string;
  message: string;
}): Promise<{ signature: string; timestampInUTCInSeconds: number }> => {
  const timestampInUTCInSeconds = Math.floor(Date.now() / 1000);
  const messageWithTimestamp = `${message}-${timestampInUTCInSeconds}`;
  const signature = await signMessage({
    privateKey,
    message: messageWithTimestamp,
  });
  return { signature, timestampInUTCInSeconds };
};

export const signMessageUsingExternalWallet = async ({
  walletName,
  message,
}: {
  walletName: keyof ExternalWalletsState["wallets"];
  message: string;
}): Promise<string | undefined> => {
  const store = getStore();
  const account = store.getState().externalWallets.wallets[walletName].account;
  if (!account) {
    toast.error("wallet is not connected");
  }
  const signMessageFunction =
    store.getState().externalWallets.wallets[walletName].signMessage;
  if (!signMessageFunction) {
    toast.error("wallet is not connected");
    return;
  }
  const signature = await signMessageFunction({
    message,
    nonce: "0",
  });

  if (!signature) {
    toast.error("Error signing message");
    return;
  }

  return signature.signature.toString();
};

export const signMessageWithTimestampUsingExternalWallet = async ({
  walletName,
  message,
}: {
  walletName: keyof ExternalWalletsState["wallets"];
  message: string;
}): Promise<
  { signature: string; timestampInUTCInSeconds: number } | undefined
> => {
  const timestampInUTCInSeconds = Math.floor(Date.now() / 1000);
  const messageWithTimestamp = `${message}-${timestampInUTCInSeconds}`;
  const signature = await signMessageUsingExternalWallet({
    walletName,
    message: messageWithTimestamp,
  });

  if (!signature) {
    toast.error("Error signing message");
    return;
  }

  return { signature: signature.toString(), timestampInUTCInSeconds };
};

export const verifyMessageSignedByExternalWallet = async ({
  walletName,
  message,
  signature,
}: {
  walletName: keyof ExternalWalletsState["wallets"];
  message: string;
  signature: string;
}): Promise<boolean> => {
  const store = getStore();
  const account = store.getState().externalWallets.wallets[walletName].account;
  if (!account) {
    toast.error("wallet is not connected");
    return false;
  }
  const publicKey = account?.publicKey.toString();

  if (!publicKey) {
    toast.error("Public key not available");
    return false;
  }

  try {
    // Create Ed25519PublicKey instance from the public key
    const ed25519PublicKey = new Ed25519PublicKey(publicKey);

    // Create Ed25519Signature instance from the signature
    const ed25519Signature = new Ed25519Signature(signature);

    // Verify the signature using the correct object parameter format
    const isValid = ed25519PublicKey.verifySignature({
      message,
      signature: ed25519Signature,
    });

    return isValid;
  } catch (error) {
    console.error("Error verifying signature:", error);
    toast.error("Error verifying signature");
    return false;
  }
};

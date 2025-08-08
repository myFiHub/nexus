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
  const signMessage =
    store.getState().externalWallets.wallets[walletName].signMessage;
  if (!signMessage) {
    toast.error("wallet is not connected");
    return;
  }
  const signature = await signMessage({
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

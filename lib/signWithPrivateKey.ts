import { ethers } from "ethers";

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

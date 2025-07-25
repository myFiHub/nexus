export const parseTokenUriToImageUrl = (tokenUri: string) => {
  const ipfsUrl = tokenUri.split("ipfs://")[1];
  if (!ipfsUrl) {
    return tokenUri;
  }
  return `https://ipfs.io/ipfs/${ipfsUrl}`;
};

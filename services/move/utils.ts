// Helper to label asset types
export const getAssetLabel = (assetType: string) => {
  if (
    assetType ===
    "0x000000000000000000000000000000000000000000000000000000000000000a"
  ) {
    return "MOVE";
  }
  return assetType;
};

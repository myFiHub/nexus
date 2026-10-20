/**
 * Constants for the Razor connect button and login option.
 * Kept in a separate file so razor/index.tsx can import them without
 * loading connectWithRazorButton (and thus @razorlabs/razorkit) during SSR.
 */

export const imagesPathsForWallets = [
  "/external_wallet_icons/nightly.png",
  "/external_wallet_icons/razor.png",
  "/external_wallet_icons/okx.svg",
  "/external_wallet_icons/leap.svg",
  "/external_wallet_icons/bitget.svg",
];
export const titleForExternalWallet = "External Wallet";
export const subtitleForExternalWallet =
  "Connect with your external wallet";

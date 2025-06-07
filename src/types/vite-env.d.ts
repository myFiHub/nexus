/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PODIUM_PROTOCOL_APTOS_ADDRESS?: string;
  readonly VITE_PODIUM_BACKEND_BASE_URL?: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 
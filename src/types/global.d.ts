declare global {
  declare interface GlobalConfig {
    id: string;
    setting: string;
  }
}

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};

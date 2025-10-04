/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_API_URL: string;
  // Add any other variables you might need here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

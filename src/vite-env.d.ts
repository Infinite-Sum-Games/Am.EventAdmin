/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EVENT_NAME: string;
  readonly VITE_EVENT_YEAR: string;
  readonly VITE_EVENT_DATES: string;
  readonly VITE_EVENT_MAIN_WEBSITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
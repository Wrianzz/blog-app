/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_DATABASE_ID: string;
  readonly VITE_APPWRITE_POSTS_TABLE_ID: string;
  readonly VITE_APPWRITE_ADMIN_TEAM_ID?: string;
  readonly VITE_ADMIN_EMAILS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
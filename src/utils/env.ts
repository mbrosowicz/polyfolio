/**
 * Utilidade para acessar variáveis de ambiente com tipagem segura
 */

type ImportMetaEnv = Record<string, string | boolean>;

export const ENV = {
  APP_TITLE: (import.meta.env as ImportMetaEnv).VITE_APP_TITLE || 'Polyfolio',
  API_URL: (import.meta.env as ImportMetaEnv).VITE_API_URL || 'http://localhost:3000/api',
  DEBUG: (import.meta.env as ImportMetaEnv).VITE_DEBUG === 'true' || import.meta.env.DEV,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
} as const;

export default ENV;

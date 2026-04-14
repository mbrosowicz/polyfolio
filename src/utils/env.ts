/**
 * Utilidade para acessar variáveis de ambiente com tipagem segura
 */

export const ENV = Object.freeze({
  APP_TITLE: (import.meta.env.VITE_APP_TITLE as string | undefined) ?? 'Polyfolio',
  API_URL: (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api',
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || Boolean(import.meta.env.DEV),
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
});

export default ENV;

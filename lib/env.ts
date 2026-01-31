/**
 * Leitura de variáveis de ambiente para testes.
 * Use BASE_URL_API e BASE_URL_UI para sobrescrever baseURL por ambiente (CI, staging, prod).
 */

const DEFAULTS = {
  api: 'https://jsonplaceholder.typicode.com',
  ui: 'https://playwright.dev',
} as const;

export function getBaseUrl(kind?: 'api' | 'ui'): string {
  if (kind === 'api') {
    return process.env.BASE_URL_API ?? process.env.BASE_URL ?? DEFAULTS.api;
  }
  if (kind === 'ui') {
    return process.env.BASE_URL_UI ?? process.env.BASE_URL ?? DEFAULTS.ui;
  }
  return process.env.BASE_URL ?? DEFAULTS.ui;
}

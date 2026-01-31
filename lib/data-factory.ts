/**
 * Helpers para gerar dados em testes (variar inputs).
 * Use em builders ou diretamente nos specs quando precisar de dados únicos.
 */

const ALPHA = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function randomString(length = 10): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHA.charAt(Math.floor(Math.random() * ALPHA.length));
  }
  return result;
}

export function randomEmail(domain = 'teste.qa'): string {
  return `qa-${randomString(8)}@${domain}`;
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

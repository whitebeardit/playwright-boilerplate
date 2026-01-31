# Visão geral

Este repositório é o padrão de automação de testes QA com **Playwright** (API + UI). Um único runner, uma estrutura de pastas definida e convenções para fixtures, dados de teste e ambiente.

## Objetivos

- **Um único runner**: todos os testes (API e tela) rodam com `npx playwright test`.
- **Estrutura clara**: o caminho da pasta indica o **tipo** (api | ui) e o **fluxo** (ex.: login, pedido).
- **Fixtures reutilizáveis**: `test` e `expect` vêm de um ponto único (`fixtures`), permitindo evoluir baseURL, auth e dados sem mudar os specs.
- **Inputs variáveis**: dados estáticos em `test-data` por fluxo; geração de dados com `lib/data-factory` e builders opcionais.

## Fluxo de uso

1. **Configuração**: variáveis de ambiente (opcional) em `.env` ou no CI; `playwright.config.ts` usa `lib/env` para baseURL.
2. **Testes**: specs em `tests/api/<fluxo>/` e `tests/ui/<fluxo>/` importam `test` e `expect` de `fixtures` e, quando necessário, dados de `test-data` ou `lib/data-factory`.
3. **Execução**: `npm run test`, `npm run test:api`, `npm run test:ui` ou por fluxo: `npx playwright test tests/api/login/`.

## Documentação por seção

- [02 - Estrutura de diretórios](02-estrutura-de-diretórios.md)
- [03 - Fixtures](03-fixtures.md)
- [04 - Test data (inputs e builders)](04-test-data.md)
- [05 - Lib (env e data-factory)](05-lib.md)
- [06 - Como adicionar um novo teste](06-como-adicionar-novo-teste.md)
- [07 - Como adicionar um novo fluxo](07-como-adicionar-novo-fluxo.md)
- [08 - Ambiente e configuração](08-ambiente-e-configuração.md)
- [09 - Comandos e opções](09-comandos-e-opcoes.md)

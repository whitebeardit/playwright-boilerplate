# Comandos e opções

Comandos para rodar os testes e opções de execução (browser visível, modo UI).

## Comandos (npm scripts)

Execute na raiz do projeto:

| Comando | Descrição |
|---------|-----------|
| `npm run test` | Roda todos os testes (API + UI) |
| `npm run test:api` | Roda apenas testes de API (`tests/api/`) |
| `npm run test:ui` | Roda apenas testes de UI (`tests/ui/`) |
| `npm run test:headed` | Roda testes de UI com o browser visível (equivale a `npm run test:ui -- --headed`) |
| `npm run report` | Abre o relatório HTML após a execução (útil depois de `npm run test`) |

### Rodar só um fluxo

```bash
npx playwright test tests/api/<fluxo>/
npx playwright test tests/ui/<fluxo>/
```

Exemplo: `npx playwright test tests/ui/whitebeard/`

---

## Opções de execução

### `--headed` (browser visível)

Por padrão os testes de UI rodam em modo **headless** (browser em segundo plano). Com `--headed`, a janela do browser é exibida.

**Quando usar:** para ver o que o teste está fazendo na tela, depurar falhas ou demonstrar um fluxo.

**Como usar:**

```bash
npm run test:headed
# ou
npx playwright test tests/ui/ --headed
# ou só um fluxo
npx playwright test tests/ui/whitebeard/ --headed
```

O script `test:headed` já inclui `--headed` para os testes de UI.

---

### `--ui` (modo UI do Playwright)

O modo UI do Playwright abre uma interface interativa para rodar e inspecionar testes: escolher quais arquivos ou testes executar, ver traces, timeline e logs.

**Quando usar:** para desenvolver ou depurar testes (rodar um arquivo ou um teste por vez, ver o que acontece em cada passo).

**Como usar:**

```bash
npx playwright test --ui
```

Isso abre a janela do Playwright UI. Você pode:

- Rodar todos os testes ou filtrar por projeto (api, ui), arquivo ou nome do teste
- Ver a execução passo a passo e os traces
- Usar o time-travel para revisar ações e locators

Para abrir o modo UI já filtrando só testes de UI:

```bash
npx playwright test tests/ui/ --ui
```

**Nota:** não há script `npm run` para `--ui`; use `npx playwright test --ui` quando precisar.

---

## Resumo rápido

| Objetivo | Comando |
|----------|---------|
| Rodar tudo (CI / validação) | `npm run test` |
| Rodar só API | `npm run test:api` |
| Rodar só UI | `npm run test:ui` |
| Ver o browser durante os testes de UI | `npm run test:headed` ou `npx playwright test tests/ui/ --headed` |
| Interface interativa para depurar | `npx playwright test --ui` |
| Ver relatório após a execução | `npm run report` |

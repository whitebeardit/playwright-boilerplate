# Como adicionar um novo fluxo

Um **fluxo** é um conjunto de testes para um mesmo contexto (ex.: login, pedido, relatório). Cada fluxo tem pasta em `tests/` e, se houver dados, em `test-data/`.

## Checklist

1. **Criar pasta do fluxo** em `tests/api/<fluxo>/` e/ou `tests/ui/<fluxo>/`.
2. **Criar pasta de dados** (se houver inputs): `test-data/api/<fluxo>/` e/ou `test-data/ui/<fluxo>/`.
3. **Definir inputs estáticos**: criar `inputs.json` (ou `inputs.ts`) com os casos; se precisar variar muito, adicionar `builder.ts` que usa `lib/data-factory`.
4. **Escrever os specs**: importar `test` e `expect` de `../../../fixtures`; usar Arrange-Act-Assert; para dados, importar de test-data ou usar builder.
5. **BaseURL**: se o fluxo for em outro domínio, configurar no projeto em `playwright.config.ts` ou via variáveis de ambiente (ver [08 - Ambiente e configuração](08-ambiente-e-configuração.md)).

## Passo a passo

### 1. Criar pastas de teste

```text
tests/api/meufluxo/          # testes de API do “meufluxo”
tests/ui/meufluxo/           # testes de tela do “meufluxo”
```

Crie pelo menos um arquivo `.spec.ts` em cada pasta que for usar (ex.: `login.spec.ts`, `pedido.spec.ts`).

### 2. Criar pastas de dados (opcional)

```text
test-data/api/meufluxo/
test-data/ui/meufluxo/
```

Coloque `inputs.json` ou `inputs.ts` e, se quiser variar dados, `builder.ts`.

### 3. Exemplo de inputs

**test-data/api/meufluxo/inputs.json**

```json
{
  "getUser": { "userId": 1 },
  "createOrder": { "productId": 10, "quantity": 2 }
}
```

**test-data/ui/meufluxo/inputs.json**

```json
{
  "baseUrl": "https://app.exemplo.com",
  "login": { "email": "qa@teste.com", "password": "senha123" }
}
```

### 4. Exemplo de spec (API)

**tests/api/meufluxo/meufluxo-api.spec.ts**

```ts
import { test, expect } from '../../../fixtures';
import inputs from '../../../test-data/api/meufluxo/inputs.json';

test.describe('Meu fluxo - API', () => {
  test('deve buscar usuário', async ({ request }) => {
    const { userId } = inputs.getUser;
    const response = await request.get(`/users/${userId}`);
    expect(response.ok()).toBeTruthy();
  });
});
```

### 5. Exemplo de spec (UI)

**tests/ui/meufluxo/meufluxo-ui.spec.ts**

```ts
import { test, expect } from '../../../fixtures';
import inputs from '../../../test-data/ui/meufluxo/inputs.json';

test.describe('Meu fluxo - UI', () => {
  test('deve exibir home', async ({ page }) => {
    await page.goto(inputs.baseUrl);
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  });
});
```

### 6. BaseURL diferente

Se o fluxo usar outro domínio:

- **Opção A:** no spec, usar URL absoluta: `page.goto('https://app.exemplo.com')` ou colocar a URL em `test-data/ui/meufluxo/inputs.json` e usar `inputs.baseUrl`.
- **Opção B:** criar um novo projeto em `playwright.config.ts` com `testMatch` para esse fluxo e `use.baseURL` específico, ou usar `BASE_URL_UI` / `BASE_URL_API` por ambiente (ver [08 - Ambiente e configuração](08-ambiente-e-configuração.md)).

## Nomenclatura

- **Pasta do fluxo:** nome curto e claro (ex.: `login`, `pedido`, `relatorio`).
- **Arquivos de spec:** `*.spec.ts`; o nome pode descrever o cenário (ex.: `login.spec.ts`, `footer.spec.ts`, `form-diagnostico.spec.ts`).

## Rodar só esse fluxo

```bash
npx playwright test tests/api/meufluxo/
npx playwright test tests/ui/meufluxo/
```

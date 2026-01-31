# Como adicionar um novo teste

Sempre que criar um novo teste, siga o padrão: importar de `fixtures`, usar dados de `test-data` quando fizer sentido e manter Arrange-Act-Assert.

## Teste de API

1. **Onde:** dentro do fluxo, em `tests/api/<fluxo>/<nome>.spec.ts` (ex.: `tests/api/login/login.spec.ts`).
2. **Import:** `test` e `expect` de `../../../fixtures` (três níveis a partir de `tests/api/<fluxo>/`).
3. **Dados:** importe de `test-data/api/<fluxo>/inputs.json` (ou `.ts`) se houver; senão defina no próprio spec.
4. **Fixture:** use `request` no argumento do teste.
5. **BaseURL:** vem do projeto no config (via `lib/env`); não precisa setar no spec.

### Exemplo mínimo (API)

```ts
// tests/api/login/login.spec.ts
import { test, expect } from '../../../fixtures';

test('deve retornar 200 ao buscar usuário', async ({ request }) => {
  const response = await request.get('/users/1');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('email');
});
```

### Exemplo com inputs (API)

```ts
// tests/api/hello/hello-api.spec.ts
import { test, expect } from '../../../fixtures';
import inputs from '../../../test-data/api/hello/inputs.json';

test('deve retornar post quando GET por id', async ({ request }) => {
  const { postId } = inputs.getPost;
  const response = await request.get(`/posts/${postId}`);
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body).toHaveProperty('id', postId);
});
```

---

## Teste de UI

1. **Onde:** dentro do fluxo, em `tests/ui/<fluxo>/<nome>.spec.ts` (ex.: `tests/ui/login/login.spec.ts`).
2. **Import:** `test` e `expect` de `../../../fixtures`.
3. **Dados:** importe de `test-data/ui/<fluxo>/inputs.json` ou use builder + `lib/data-factory` se precisar variar.
4. **Fixture:** use `page` (e opcionalmente `context`).
5. **Navegação:** `page.goto('/caminho')` é relativo ao baseURL do projeto; para outro domínio use URL absoluta (ex.: `page.goto('https://...')`).

### Exemplo mínimo (UI)

```ts
// tests/ui/login/login.spec.ts
import { test, expect } from '../../../fixtures';

test('deve exibir título da página de login', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveTitle(/Login/);
});

test('deve fazer login e redirecionar', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('E-mail').fill('usuario@teste.com');
  await page.getByLabel('Senha').fill('senha123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/dashboard/);
});
```

### Exemplo com inputs e builder (UI)

```ts
// tests/ui/whitebeard/whitebeard-forms.spec.ts
import { test, expect } from '../../../fixtures';
import inputs from '../../../test-data/ui/whitebeard/inputs.json';
import { createFormInput } from '../../../test-data/ui/whitebeard/builder';
import { randomEmail } from '../../../lib/data-factory';

test('preencher formulário com dados estáticos', async ({ page }) => {
  await page.goto(inputs.formUrl);
  const { nome, email, cargo, empresa } = inputs.sobreVoce;
  await form.locator('...').fill(nome);
  await form.locator('...').fill(email);
  // ...
});

test('preencher com email gerado', async ({ page }) => {
  const formInput = createFormInput({ email: randomEmail() });
  await page.goto(inputs.formUrl);
  await form.locator('...').fill(formInput.email);
  // ...
});
```

---

## Checklist rápido

- [ ] Arquivo em `tests/api/<fluxo>/` ou `tests/ui/<fluxo>/` com sufixo `.spec.ts`.
- [ ] Import de `test` e `expect` de `../../../fixtures`.
- [ ] Dados em `test-data` quando houver inputs reutilizáveis; builder quando precisar variar.
- [ ] Nome do teste descritivo (cenário + resultado esperado).
- [ ] Arrange-Act-Assert quando ajudar na leitura.

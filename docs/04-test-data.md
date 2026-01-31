# Test data (inputs e builders)

Os dados de entrada dos testes ficam em `test-data/`, organizados por tipo (api | ui) e fluxo. Isso permite **inserir novos inputs** editando arquivos em um só lugar e **gerar dados diferentes** com builders e `lib/data-factory`.

## Estrutura

```
test-data/
├── api/
│   └── <fluxo>/
│       └── inputs.json   # ou inputs.ts
└── ui/
    └── <fluxo>/
        ├── inputs.json   # ou inputs.ts
        └── builder.ts    # opcional
```

- **inputs.json / inputs.ts**: entradas estáticas (um objeto ou vários cenários).
- **builder.ts** (opcional): função que monta um objeto padrão e aceita overrides; pode usar `lib/data-factory` para gerar valores.

## Inserir novos inputs (estáticos)

1. Crie ou edite a pasta do fluxo: `test-data/api/<fluxo>/` ou `test-data/ui/<fluxo>/`.
2. Adicione ou altere `inputs.json` (ou `inputs.ts`).

### Exemplo: inputs.json (API)

**Arquivo:** `test-data/api/hello/inputs.json`

```json
{
  "getPost": { "postId": 1 },
  "createPost": {
    "title": "Título do post",
    "body": "Corpo do post",
    "userId": 1
  }
}
```

**Uso no spec:**

```ts
import inputs from '../../../test-data/api/hello/inputs.json';

test('GET por id', async ({ request }) => {
  const { postId } = inputs.getPost;
  const response = await request.get(`/posts/${postId}`);
  expect(response.ok()).toBeTruthy();
});
```

### Exemplo: inputs.json (UI)

**Arquivo:** `test-data/ui/whitebeard/inputs.json`

```json
{
  "formUrl": "https://www.whitebeard.ac/forms",
  "sobreVoce": {
    "nome": "Maria Silva",
    "email": "maria.silva@empresa.com.br",
    "cargo": "Tech Lead",
    "empresa": "Empresa Teste QA"
  },
  "desafios": "Comunicação e priorização de demandas",
  "contato": "E-mail ou WhatsApp",
  "estagioSlider": 4
}
```

**Uso no spec:**

```ts
import inputs from '../../../test-data/ui/whitebeard/inputs.json';

test('preencher formulário', async ({ page }) => {
  await page.goto(inputs.formUrl);
  const { nome, email, cargo, empresa } = inputs.sobreVoce;
  await form.locator('...').fill(nome);
  await form.locator('...').fill(email);
  // ...
});
```

## Gerar dados diferentes (builder + data-factory)

Quando precisar **variar** dados (ex.: email único por execução), use um **builder** que chama `lib/data-factory`.

### Exemplo: builder.ts

**Arquivo:** `test-data/ui/whitebeard/builder.ts`

```ts
import { randomEmail } from '../../../lib/data-factory';

export interface FormInput {
  nome: string;
  email: string;
  cargo: string;
  empresa: string;
  // ...
}

const DEFAULTS: FormInput = {
  nome: 'Maria Silva',
  email: 'maria.silva@empresa.com.br',
  cargo: 'Tech Lead',
  empresa: 'Empresa Teste QA',
  // ...
};

export function createFormInput(overrides?: Partial<FormInput>): FormInput {
  return { ...DEFAULTS, ...overrides };
}
```

**Uso no spec (email gerado):**

```ts
import { createFormInput } from '../../../test-data/ui/whitebeard/builder';
import { randomEmail } from '../../../lib/data-factory';

test('formulário com email gerado', async ({ page }) => {
  const formInput = createFormInput({ email: randomEmail() });
  await page.goto(inputs.formUrl);
  await form.locator('...').fill(formInput.email);
  // ...
});
```

## Quando usar o quê

- **Só inputs estáticos**: use apenas `inputs.json` (ou `inputs.ts`) e importe no spec.
- **Precisa variar alguns campos**: crie `builder.ts` que usa `randomEmail()`, `randomString()` etc. de `lib/data-factory` e aceita `overrides`; use o builder no spec.

# Estrutura de diretórios

Cada diretório tem um papel definido. O caminho já indica **tipo de teste** e **fluxo**.

## Árvore

```
QA/
├── docs/                 # Documentação (esta pasta)
├── fixtures/             # Test estendido; todos os specs importam daqui
├── lib/                  # Utilitários compartilhados (env, data-factory)
├── test-data/            # Dados de entrada por fluxo (api e ui)
├── tests/                # Specs por tipo e fluxo
│   ├── api/<fluxo>/      # Testes de API do fluxo
│   └── ui/<fluxo>/       # Testes de tela do fluxo
├── .env.example          # Exemplo de variáveis de ambiente
├── package.json
├── playwright.config.ts  # Configuração do Playwright
├── README.md
└── tsconfig.json
```

## Diretórios

### `fixtures/`

- **Papel**: exportar o `test` estendido e o `expect` para que todos os specs importem daqui (não de `@playwright/test`).
- **Arquivo principal**: `index.ts` — faz `test.extend({})` e exporta `test` e `expect`.
- **Por que**: um único ponto para evoluir (baseURL por env, auth, fixture de inputs) sem alterar os arquivos de teste.

### `lib/`

- **Papel**: código compartilhado entre testes e config.
- **Arquivos**:
  - `env.ts`: leitura de `BASE_URL_API`, `BASE_URL_UI`, `BASE_URL`; usado em `playwright.config.ts`.
  - `data-factory.ts`: `randomString()`, `randomEmail()`, `randomNumber()` para gerar dados em testes e builders.

### `test-data/`

- **Papel**: dados de entrada por fluxo, espelhando `tests/`.
- **Estrutura**: `test-data/api/<fluxo>/` e `test-data/ui/<fluxo>/`.
- **Conteúdo típico**:
  - `inputs.json` ou `inputs.ts`: entradas estáticas (ex.: postId, corpo do post, dados do formulário).
  - `builder.ts` (opcional): função que monta um objeto padrão e aceita overrides (ex.: `createFormInput({ email: randomEmail() })`).
- **Uso**: specs importam de `test-data` ou usam o builder; assim fica fácil localizar e alterar inputs por fluxo.

### `tests/`

- **Papel**: arquivos de teste (specs).
- **Estrutura**:
  - `tests/api/<fluxo>/*.spec.ts`: testes que usam o fixture `request` (sem browser).
  - `tests/ui/<fluxo>/*.spec.ts`: testes que usam o fixture `page` (E2E no browser).
- **Convenção**: o nome da pasta é o **fluxo** (ex.: `login`, `pedido`, `hello`). Assim, `tests/api/login/` = testes de API do fluxo de login.

### Raiz do projeto

- **playwright.config.ts**: projetos (api, ui), baseURL via `getBaseUrl()`, timeouts, reporter, trace.
- **.env.example**: lista de variáveis (BASE_URL, BASE_URL_API, BASE_URL_UI, AUTH_TOKEN); copiar para `.env` e não commitar.
- **package.json**: scripts `test`, `test:api`, `test:ui`, `test:headed`, `report`.

## Localizar o fluxo

- **Qual fluxo?** → nome da pasta em `tests/api/` ou `tests/ui/` (ex.: `hello`, `whitebeard`).
- **Onde estão os inputs desse fluxo?** → `test-data/api/<fluxo>/` ou `test-data/ui/<fluxo>/`.
- **Rodar só um fluxo**: `npx playwright test tests/api/login/` ou `npx playwright test tests/ui/pedido/`.

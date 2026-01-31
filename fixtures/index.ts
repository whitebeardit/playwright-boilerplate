import { test as base, expect } from '@playwright/test';

/**
 * Test estendido com fixtures compartilhados.
 * Todos os specs devem importar test e expect daqui para manter o padrão
 * e permitir evolução (baseURL por env, auth, inputs por fluxo) sem mudar os specs.
 */
const test = base.extend<Record<string, never>>({});

export { test, expect };

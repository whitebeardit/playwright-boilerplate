import { randomString } from '../../../lib/data-factory';

export interface CategoriaInput {
  nome: string;
  descricao: string;
}

const DESC_PADRAO = 'Descrição da categoria criada pelo teste automatizado';

/**
 * Monta um objeto de entrada para cadastro de categoria com nome único (não se repete).
 * Use no spec para evitar conflito ao cadastrar várias categorias.
 */
export function buildCategoriaInput(overrides?: Partial<CategoriaInput>): CategoriaInput {
  const nome = `Categoria QA ${randomString(8)}`;
  return {
    nome,
    descricao: DESC_PADRAO,
    ...overrides,
  };
}

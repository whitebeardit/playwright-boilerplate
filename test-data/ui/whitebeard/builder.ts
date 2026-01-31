import { randomEmail } from '../../../lib/data-factory';

export interface FormInput {
  nome: string;
  email: string;
  cargo: string;
  empresa: string;
  desafios: string;
  contato: string;
  estagioSlider: number;
}

const DEFAULTS: FormInput = {
  nome: 'Maria Silva',
  email: 'maria.silva@empresa.com.br',
  cargo: 'Tech Lead',
  empresa: 'Empresa Teste QA',
  desafios: 'Comunicação e priorização de demandas',
  contato: 'E-mail ou WhatsApp',
  estagioSlider: 4,
};

/**
 * Monta um objeto de entrada do formulário com valores padrão.
 * Passe overrides para variar (ex.: createFormInput({ email: randomEmail() })).
 */
export function createFormInput(overrides?: Partial<FormInput>): FormInput {
  return { ...DEFAULTS, ...overrides };
}

import {
  CPF_REGEX,
  STRING_REGEX,
  CEP_REGEX,
  STATE_REGEX,
  PHONE_REGEX,
  TEXT_REGEX,
  NUMBER_REGEX,
} from '../../../core/formatters';
export const constraints = {
  cpf: {
    presence: true,
    format: {
      pattern: CPF_REGEX,
      message: '^CPF inválido.',
    },
  },
  name: {
    presence: true,
    format: {
      pattern: TEXT_REGEX,
      message: 'inválido.',
    },
  },
  cep: {
    presence: true,
    format: {
      pattern: CEP_REGEX,
      message: '^ CEP inválido.',
    },
  },
  address: {
    presence: true,
    format: {
      pattern: STRING_REGEX,
      message: '^Endereço inválido.',
    },
  },
  city: {
    presence: true,
    format: {
      pattern: STRING_REGEX,
      message: '^Cidade inválida.',
    },
  },
  state: {
    presence: true,
    format: {
      pattern: STATE_REGEX,
      message: '^Estadp inválido.',
    },
  },

  telephone: {
    presence: true,
    format: {
      pattern: PHONE_REGEX,
      message: '^Celular inválido.',
    },
  },
  bank: {
    presence: true,
    format: {
      pattern: STRING_REGEX,
      message: '^Banco inválido.',
    },
  },
  bank_ag: {
    presence: true,
    format: {
      pattern: NUMBER_REGEX,
      message: '^Agnência inválida.',
    },
  },
  bank_cc: {
    presence: true,
    format: {
      pattern: NUMBER_REGEX,
      message: '^Conta inválida.',
    },
  },
  account_type: {
    presence: true,
    format: {
      pattern: TEXT_REGEX,
      message: '^Tipo de conta inválida.',
    },
  },
};

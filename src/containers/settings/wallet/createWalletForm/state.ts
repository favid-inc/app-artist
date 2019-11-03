import React from 'react';

import { BankAccount, Recipient, RegisterInformation } from '../types';

type CreateWalletState = [
  BankAccount,
  (bankAccount: BankAccount) => void,
  RegisterInformation,
  (registerInfomation: RegisterInformation) => void
];

interface Props {
  recipient?: Recipient;
}

export function useCreateWalletState({ recipient }: Props): CreateWalletState {
  const [bankAccount, setBankAccount] = React.useState<BankAccount>(
    (recipient && recipient.bank_account) || {
      agencia: '',
      agencia_dv: '',
      bank_code: '',
      conta: '',
      conta_dv: '',
      document_number: '',
      legal_name: '',
      type: 'conta_corrente',
    },
  );

  const [registerInformation, setRegisterInfomation] = React.useState<RegisterInformation>(
    (recipient && recipient.register_information) || {
      type: 'individual',
      document_number: '',
      email: '',
      name: '',
      phone_numbers: [{ type: 'mobile', ddd: '', number: '' }],
    },
  );

  React.useEffect(() => {
    switch (registerInformation.type) {
      case 'individual':
        setBankAccount({
          ...bankAccount,
          document_number: registerInformation.document_number,
          legal_name: registerInformation.name,
        });
        break;
      case 'corporation':
        setBankAccount({
          ...bankAccount,
          document_number: registerInformation.document_number,
          legal_name: registerInformation.company_name,
        });
        break;
    }
  }, [registerInformation]);

  return [bankAccount, setBankAccount, registerInformation, setRegisterInfomation];
}

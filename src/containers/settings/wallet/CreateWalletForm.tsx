import React from 'react';
import { View } from 'react-native';
import { BankAccountForm } from './createWalletForm/BankAccountForm';
import { BankAccount } from './types';

export function CreateWalletForm() {
  const [bankAccount, setBankAccount] = React.useState<BankAccount>(() => ({
    agencia: '',
    agencia_dv: '',
    bank_code: '',
    conta: '',
    conta_dv: '',
    document_number: '',
    legal_name: '',
    type: 'conta_corrente',
  }));

  return (
    <View style={{ padding: 10 }}>
      <BankAccountForm bankAccount={bankAccount} onChange={setBankAccount} />
    </View>
  );
}

import React from 'react';
import { View } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { BankAccount, RegisterInformation } from '../types';

import { BankAccountForm } from './BankAccountForm';
import { RegisterInformationForm } from './RegisterInformationForm';

interface ComponentProps {
  children?: React.ReactNode;
}

type Props = ComponentProps & ThemedComponentProps;

export function CreateWalletFormComponent({ themedStyle }: Props) {
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

  const [registerInfomation, setRegisterInfomation] = React.useState<RegisterInformation>(() => ({
    type: 'individual',
    document_number: '',
    email: '',
    name: '',
    phone_numbers: [{ type: 'mobile', ddd: '', number: '' }],
  }));

  React.useEffect(() => {
    switch (registerInfomation.type) {
      case 'individual':
        setBankAccount({
          ...bankAccount,
          document_number: registerInfomation.document_number,
          legal_name: registerInfomation.name,
        });
        break;
      case 'corporation':
        setBankAccount({
          ...bankAccount,
          document_number: registerInfomation.document_number,
          legal_name: registerInfomation.company_name,
        });
        break;
    }
  }, [registerInfomation]);

  return (
    <View style={themedStyle.container}>
      <RegisterInformationForm value={registerInfomation} onChange={setRegisterInfomation} themedStyle={themedStyle} />
      <BankAccountForm value={bankAccount} onChange={setBankAccount} themedStyle={themedStyle} />
    </View>
  );
}

export const CreateWalletForm = withStyles<ComponentProps>(CreateWalletFormComponent, (theme: ThemeType) => ({
  container: {
    padding: 10,
  },
  middleContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  inputText: {
    color: theme['text-alternative-color'],
  },
  input: {
    flexWrap: 'wrap',
    flex: 1,
    backgroundColor: theme['background-alternative-color-1'],
    borderColor: theme['text-alternative-color'],
  },
}));

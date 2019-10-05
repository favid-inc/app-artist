import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { View } from 'react-native';

import { Recipient } from '../types';
import { BankAccountForm } from './BankAccountForm';
import { RegisterInformationForm } from './RegisterInformationForm';
import { useCreateWalletState } from './state';
import { SubmitButton } from './SubmitButton';

interface ComponentProps {
  recipient?: Recipient;
  onSubmitSuccess: (recipient: Recipient) => void;
  children?: React.ReactNode;
}

type Props = ComponentProps & ThemedComponentProps;

export function CreateWalletFormComponent({ recipient, onSubmitSuccess, themedStyle }: Props) {
  const [bankAccount, setBankAccount, registerInformation, setRegisterInfomation] = useCreateWalletState({ recipient });

  return (
    <View style={themedStyle.container}>
      <RegisterInformationForm value={registerInformation} onChange={setRegisterInfomation} themedStyle={themedStyle} />
      <BankAccountForm value={bankAccount} onChange={setBankAccount} themedStyle={themedStyle} />
      <SubmitButton
        bankAccount={bankAccount}
        registerInformation={registerInformation}
        onSubmitSuccess={onSubmitSuccess}
      />
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

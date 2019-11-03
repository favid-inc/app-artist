import { Button } from '@kitten/ui';
import React from 'react';
import { Alert } from 'react-native';

import { BankAccount, Recipient, RegisterInformation } from '../types';
import { createWallet } from './createWallet';

interface ComponentProps {
  onSubmitSuccess: (recipient: Recipient) => void;
  bankAccount: BankAccount;
  registerInformation: RegisterInformation;
}

type Props = ComponentProps;

export function SubmitButton({ bankAccount, registerInformation, onSubmitSuccess }: Props) {
  const [isSubmiting, setIsSubmiting] = React.useState<boolean>(false);

  const handleSubmit = React.useCallback(async () => {
    setIsSubmiting(true);
    try {
      const response = await createWallet({ bankAccount, registerInformation });
      onSubmitSuccess(response);
      Alert.alert('Sucesso', 'Dados atualizados');
    } catch (e) {
      Alert.alert('Erro', 'Verifique os dados e tente novamente');
    } finally {
      setIsSubmiting(false);
    }
  }, [setIsSubmiting, bankAccount, registerInformation, onSubmitSuccess]);

  return (
    <Button size='giant' onPress={handleSubmit} disabled={isSubmiting}>
      {isSubmiting ? 'Enviando..' : 'Enviar dados bancários'}
    </Button>
  );
}

import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import React from 'react';
import { View } from 'react-native';

import { SettingsContext } from '../context';
import { InfoItem } from './InfoItem';

type Props = ThemedComponentProps;

type Context = typeof SettingsContext;

class BankAccountInfoComponent extends React.Component<Props, {}, Context> {
  static contextType = SettingsContext;
  public context: React.ContextType<Context>;

  public render() {
    const { themedStyle } = this.props;
    const { walletInfo } = this.context;

    if (!walletInfo) {
      return <View style={themedStyle.walletCard} />;
    }

    const { bankAccount } = walletInfo;

    if (!bankAccount) {
      return (
        <View style={themedStyle.walletCard}>
          <Text appearance='hint' style={themedStyle.title}>
            Os dados bancários ainda não foram informados.
          </Text>
        </View>
      );
    }

    return (
      <View style={themedStyle.walletCard}>
        <InfoItem hint='Nome' value={bankAccount.legal_name} />
        <InfoItem hint='CPF' value={bankAccount.document_number} />
        <InfoItem hint='Banco' value={bankAccount.bank_code} />
        <InfoItem hint='Agência' value={`${bankAccount.agencia}-${bankAccount.agencia_dv}`} />
        <InfoItem hint='Conta' value={`${bankAccount.conta}-${bankAccount.conta_dv}`} />
        <InfoItem hint='Operação' value={bankAccount.type} />
      </View>
    );
  }
}

export const BankAccountInfo = withStyles(BankAccountInfoComponent, (theme: ThemeType) => ({
  walletCard: {
    backgroundColor: theme['background-basic-color-1'],
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 6,
  },
}));

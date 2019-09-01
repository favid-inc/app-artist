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

  public isVerified = (): boolean => {
    const { walletInfo } = this.context;
    return walletInfo && walletInfo['is_verified?'];
  };

  public render() {
    const { themedStyle } = this.props;
    const { walletInfo } = this.context;

    if (!walletInfo) {
      return <View style={themedStyle.walletCard} />;
    }

    const { informations } = walletInfo;

    if (!informations || !informations.length) {
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
        <InfoItem hint='Nome' value={(informations.find((i) => i.key === 'name') || { value: '' }).value} />
        <InfoItem hint='CPF' value={(informations.find((i) => i.key === 'cpf') || { value: '' }).value} />
        <InfoItem hint='Banco' value={(informations.find((i) => i.key === 'bank') || { value: '' }).value} />
        <InfoItem hint='Agência' value={(informations.find((i) => i.key === 'bank_ag') || { value: '' }).value} />
        <InfoItem hint='Conta' value={(informations.find((i) => i.key === 'bank_cc') || { value: '' }).value} />
        <InfoItem hint='Operação' value={(informations.find((i) => i.key === 'account_type') || { value: '' }).value} />
        <InfoItem
          hint='Transf. Automatica'
          value={(informations.find((i) => i.key === 'automatic_transfer') || { value: '' }).value ? 'Sim' : 'Não'}
        />
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

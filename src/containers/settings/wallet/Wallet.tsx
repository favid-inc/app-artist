import { LoadWalletInfo } from '@favid-inc/api/lib/app-artist';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import { apiClient } from '@src/core/utils/apiClient';
import React from 'react';
import { ActivityIndicator, Alert, View, ViewProps } from 'react-native';

import { Card } from './Card';
import { InfoItem } from './InfoItem';

interface ComponentProps {
  onNavigate: (pathName: string) => void;
}

export type Props = ComponentProps & ThemedComponentProps & ViewProps;

interface State {
  balance?: LoadWalletInfo['Response']['balance'];
  bankAccount?: LoadWalletInfo['Response']['recipient']['bank_account'];
  loading: boolean;
  recipient?: LoadWalletInfo['Response']['recipient'];
}

class WalletComponent extends React.Component<Props, State> {
  public state: State = {
    loading: false,
  };

  public async componentDidMount() {
    this.setState({ loading: true });

    try {
      const request: LoadWalletInfo['Request'] = {
        url: '/LoadWalletInfo',
        method: 'GET',
      };

      const {
        data: { balance, recipient },
      } = await apiClient.request<LoadWalletInfo['Response']>(request);

      const bankAccount = recipient.bank_account;

      this.setState({ balance, bankAccount, recipient });
    } catch (e) {
      Alert.alert('Erro ao buscar dados da carteira');
    } finally {
      this.setState({ loading: false });
    }
  }

  public render() {
    const { style, themedStyle, ...restProps } = this.props;

    if (this.state.loading) {
      return (
        <View style={[themedStyle.container, style]} {...restProps}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    const { balance, bankAccount, recipient } = this.state;

    return (
      <View style={[themedStyle.container, style]} {...restProps}>
        {recipient && (
          <Card>
            <InfoItem hint='Status' value={recipient.status} />
          </Card>
        )}
        {bankAccount && (
          <Card>
            <Text appearance='hint' style={themedStyle.title} category='h5'>
              Dados Bancários
            </Text>
            <InfoItem hint='Nome' value={bankAccount.legal_name} />
            <InfoItem hint='CPF' value={bankAccount.document_number} />
            <InfoItem hint='Banco' value={bankAccount.bank_code} />
            <InfoItem hint='Agência' value={`${bankAccount.agencia}-${bankAccount.agencia_dv}`} />
            <InfoItem hint='Conta' value={`${bankAccount.conta}-${bankAccount.conta_dv}`} />
            <InfoItem hint='Operação' value={bankAccount.type} />
          </Card>
        )}
        {balance && (
          <Card>
            <InfoItem hint='Saldo' value={`R$ ${balance.available.amount || 0}`} />
          </Card>
        )}
      </View>
    );
  }
}

export const Wallet = withStyles(WalletComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    paddingVertical: 40,
    backgroundColor: theme['background-basic-color-2'],
  },
  title: {
    textAlign: 'center',
  },
}));

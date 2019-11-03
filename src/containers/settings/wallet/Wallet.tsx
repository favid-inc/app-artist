import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import React from 'react';
import { ActivityIndicator, Alert, View, ViewProps } from 'react-native';

import { Card } from './Card';
import { CreateWalletForm } from './createWalletForm';
import { InfoItem } from './InfoItem';
import { loadWalletInfo } from './loadWalletInfo';
import { Balance, Recipient } from './types';

interface ComponentProps {
  onNavigate: (pathName: string) => void;
}

export type Props = ComponentProps & ThemedComponentProps & ViewProps;

interface State {
  balance?: Balance;
  loading: boolean;
  recipient?: Recipient;
}

class WalletComponent extends React.Component<Props, State> {
  public state: State = {
    loading: false,
  };

  public async componentDidMount() {
    this.setState({ loading: true });

    try {
      this.setState(await loadWalletInfo());
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

    const { balance, recipient } = this.state;

    return (
      <View style={[themedStyle.container, style]} {...restProps}>
        {recipient && (
          <Card>
            <InfoItem hint='Status' value={recipient.status} />
          </Card>
        )}
        {balance && (
          <Card>
            <InfoItem hint='Saldo' value={`R$ ${balance.available.amount || 0}`} />
          </Card>
        )}
        <Card>
          <Text appearance='hint' style={themedStyle.title} category='h5'>
            {recipient && recipient.bank_account ? 'Atualizar dados Bancários' : 'Enviar dados Bancários'}
          </Text>
          <CreateWalletForm recipient={recipient} onSubmitSuccess={this.onSubmitSuccess} />
        </Card>
      </View>
    );
  }

  private onSubmitSuccess = (recipient: Recipient) => {
    this.setState({ recipient });
  };
}

export const Wallet = withStyles(WalletComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
  title: {
    textAlign: 'center',
    paddingVertical: 10,
  },
}));

import React from 'react';
import { ActivityIndicator, Alert, View, ViewProps } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text } from '@kitten/ui';
import { LoadWalletInfo } from '@favid-inc/api/lib/app-artist';
import { apiClient } from '@src/core/utils/apiClient';

import { SettingsContext } from '../context';
import { BankAccountInfo } from './BankAccountInfo';
import { WithdrawCard } from './WithdrawCard';

interface ComponentProps {
  onNavigate: (pathName: string) => void;
}

export type Props = ComponentProps & ThemedComponentProps & ViewProps;

interface State {
  loading: boolean;
}

class WalletComponent extends React.Component<Props, State> {
  static contextType = SettingsContext;
  public context: React.ContextType<typeof SettingsContext>;

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

      const response = await apiClient.request<LoadWalletInfo['Response']>(request);

      this.context.setWalletInfo(response.data);
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

    return (
      <View style={[themedStyle.container, style]} {...restProps}>
        <Text appearance='hint' style={themedStyle.title} category='h5'>
          Dados Bancários
        </Text>
        <BankAccountInfo />
        <WithdrawCard onWithdraw={this.navigateToWithdraw} />
      </View>
    );
  }

  // private navigateToWalletForm = () => {
  //   this.props.onNavigate('Dados Bancários');
  // };
  private navigateToWithdraw = () => {
    this.props.onNavigate('Sacar Dinheiro');
  };
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

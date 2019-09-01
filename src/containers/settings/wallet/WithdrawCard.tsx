import React from 'react';
import { View, ViewProps } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Text, Button } from '@kitten/ui';

import { textStyle } from '@src/components/common';
import { SettingsContext } from '../context';
import { InfoItem } from './InfoItem';

interface ComponentProps {
  onWithdraw: () => void;
}

export type Props = ComponentProps & ThemedComponentProps & ViewProps;

class WithdrawCardComponent extends React.Component<Props> {
  static contextType = SettingsContext;
  public context: React.ContextType<typeof SettingsContext>;

  public render() {
    const { walletInfo } = this.context;

    if (!walletInfo) {
      return <View />;
    }

    const { themedStyle } = this.props;

    return (
      <View style={themedStyle.walletCard}>
        <InfoItem hint='Saldo' value={walletInfo.receivable_balance} />
        <InfoItem hint='Disponível para Saque' value={walletInfo.balance_available_for_withdraw} />
        <Button
          status='success'
          size='giant'
          style={themedStyle.withdrawRequestButton}
          textStyle={textStyle.button}
          onPress={this.onWithdraw}
        >
          Sacar
        </Button>
      </View>
    );
  }

  private onWithdraw = () => {
    this.props.onWithdraw();
  };
}

export const WithdrawCard = withStyles<ComponentProps>(WithdrawCardComponent, (theme: ThemeType) => ({
  walletCard: {
    // alignItems: 'flex-start',
    backgroundColor: theme['background-basic-color-1'],
    marginVertical: 10,
    borderRadius: 6,
  },
  withdrawRequestButton: {
    flex: 1,
    alignSelf: 'center',
    marginVertical: 10,
  },
}));

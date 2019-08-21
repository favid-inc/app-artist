import React from 'react';
import { SettingsContext } from '../context';
import { View, ViewProps } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from 'react-native-ui-kitten/theme';
import { Text, Button } from 'react-native-ui-kitten/ui';
import { textStyle } from '@src/components/common';

interface ComponentProps {
  onTransfer: () => void;
}

export type Props = ComponentProps & ThemedComponentProps & ViewProps;

class TransferCardComponent extends React.Component<Props> {
  static contextType = SettingsContext;
  public context: React.ContextType<typeof SettingsContext>;

  public onTransfer = () => {
    this.props.onTransfer();
  };

  public render() {
    const { themedStyle } = this.props;
    const { payment } = this.context;
    return payment && payment.cash ? (
      <View style={themedStyle.walletCard}>
        <Text appearance='hint' style={themedStyle.center} category='h6'>
          Saldo
        </Text>
        <Text appearance='hint' style={themedStyle.center} category='h4'>
          {`R$ ${payment.cash}`}
        </Text>
        <Button
          status='success'
          size='giant'
          style={themedStyle.saveButton}
          textStyle={textStyle.button}
          onPress={this.onTransfer}
        >
          Transferir
        </Button>
      </View>
    ) : null;
  }
}

export const TransferCard = withStyles(TransferCardComponent, (theme: ThemeType) => ({
  center: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  walletCard: {
    alignItems: 'flex-start',
    backgroundColor: theme['background-basic-color-1'],
    marginVertical: 20,
    marginHorizontal: 40,
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  saveButton: {
    alignSelf: 'center',
    marginVertical: 10,
  },
}));

import React from 'react';
import { SettingsContext } from '../context';
import { View, ViewProps } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from 'react-native-ui-kitten/theme';
import { Text, Button } from 'react-native-ui-kitten/ui';
import { textStyle } from '@src/components/common';

interface ComponentProps {
  onAddWallet: () => void;
}

export type Props = ComponentProps & ThemedComponentProps & ViewProps;

class BankCardComponent extends React.Component<Props> {
  public isProcessing = (): boolean => {
    const { payment } = this.context;
    return payment && payment.status === 'processing';
  };

  public onAddWallet = () => {
    this.props.onAddWallet();
  };

  public hasPayment = (): boolean => {
    const { payment } = this.context;
    return payment && Boolean(payment.bank);
  };

  public render() {
    const { style, themedStyle, ...restProps } = this.props;
    const { payment } = this.context;
    const isProcessing = this.isProcessing();
    return this.hasPayment() ? (
      <View style={themedStyle.walletCard}>
        <Text appearance='hint'>{`Nome:${payment.name}`}</Text>
        <Text appearance='hint'>{`CPF:${payment.cpf}`}</Text>
        <Text appearance='hint'>{`Banco:${payment.bank}`}</Text>
        <Text appearance='hint'>{`Agência:${payment.bank_ag}`}</Text>
        <Text appearance='hint'>{`Conta:${payment.bank_cc}`}</Text>
        <Button
          status='info'
          style={themedStyle.saveButton}
          textStyle={textStyle.button}
          disabled={isProcessing}
          onPress={this.onAddWallet}
        >
          {isProcessing ? 'Verificando...' : 'Alterar'}
        </Button>
      </View>
    ) : (
      <View style={themedStyle.walletCard}>
        <Text appearance='hint' style={themedStyle.title}>
          Os dados bancários ainda não foram informados.
        </Text>
        <Button
          status='info'
          size='giant'
          style={themedStyle.saveButton}
          textStyle={textStyle.button}
          onPress={this.onAddWallet}
        >
          Adicionar Dados
        </Button>
      </View>
    );
  }
}

export const BankCard = withStyles(BankCardComponent, (theme: ThemeType) => ({
  title: {
    textAlign: 'center',
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

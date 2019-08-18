import React from 'react';
import { SettingsContext } from '../context';
import { View, ViewProps } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from 'react-native-ui-kitten/theme';
import { Text } from 'react-native-ui-kitten/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BankCard } from './BankCard';
import { TransferCard } from './TransferCard';

interface ComponentProps {
  onNavigate: (pathName: string) => void;
}

export type Props = ComponentProps & ThemedComponentProps & ViewProps;
class MyWalletComponent extends React.Component<Props> {
  static contextType = SettingsContext;
  public context: React.ContextType<typeof SettingsContext>;

  public navigateToWalletForm = () => {
    this.props.onNavigate('Dados Bancários');
  };
  public navigateToTransferForm = () => {
    this.props.onNavigate('Transferir Dinheiro');
  };

  public render() {
    const { style, themedStyle, ...restProps } = this.props;

    return (
      <KeyboardAwareScrollView>
        <View style={[themedStyle.container, style]} {...restProps}>
          <Text appearance='hint' style={themedStyle.title} category='h5'>
            Dados Bancários
          </Text>
          <BankCard onAddWallet={this.navigateToWalletForm} />
          <TransferCard onTransfer={this.navigateToTransferForm} />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export const MyWallet = withStyles(MyWalletComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    paddingVertical: 40,
    backgroundColor: theme['background-basic-color-2'],
  },
  title: {
    textAlign: 'center',
  },
}));

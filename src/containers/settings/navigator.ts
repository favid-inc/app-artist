import { connect } from './context';
import { MyWalletForm } from './myWallet/MyWalletForm';
import { Transfer } from './myWallet/Transfer';
import { SettingsContainer } from './SettingsContainer';
import { createStackNavigator } from 'react-navigation';
import { AccountContainer } from './account/AccountContainer';
import { MyWalletContainer } from './myWallet/MyWalletContainter';
import { TopBarNavigationOptions } from '@src/core/navigation/options';

export const SettingsNavigator = connect(
  createStackNavigator(
    {
      "Configurações": SettingsContainer,
      "Conta": AccountContainer,
      'Minha Carteira': MyWalletContainer,
      'Dados Bancários': MyWalletForm,
      'Transferir Dinheiro': Transfer,
    },
    {
      headerMode: 'screen',
      defaultNavigationOptions: TopBarNavigationOptions,
    },
  ),
);

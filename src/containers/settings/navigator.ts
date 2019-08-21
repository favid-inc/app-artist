import { connect } from './context';
import { WalletForm } from './wallet/WalletForm';
import { Transfer } from './wallet/Transfer';
import { SettingsContainer } from './SettingsContainer';
import { createStackNavigator } from 'react-navigation';
import { AccountContainer } from './account/AccountContainer';
import { WalletContainer } from './wallet/WalletContainter';
import { TopBarNavigationOptions } from '@src/core/navigation/options';

export const SettingsNavigator = connect(
  createStackNavigator(
    {
      'Configurações': SettingsContainer,
      'Conta': AccountContainer,
      'Minha Carteira': WalletContainer,
      'Dados Bancários': WalletForm,
      'Transferir Dinheiro': Transfer,
    },
    {
      headerMode: 'screen',
      defaultNavigationOptions: TopBarNavigationOptions,
    },
  ),
);

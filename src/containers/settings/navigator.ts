import { createStackNavigator } from 'react-navigation';

import { AccountContainer } from '@src/containers/account';
import { PoliciesContainer } from '@src/containers/policies';
import { TopBarNavigationOptions } from '@src/core/navigation/options';

import { SettingsContainer } from './SettingsContainer';
import { WalletNavigation } from './wallet';

export const SettingsNavigator = createStackNavigator(
  {
    Configurações: SettingsContainer,
    Políticas: PoliciesContainer,
    Conta: AccountContainer,
    ...WalletNavigation,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: TopBarNavigationOptions,
  },
);

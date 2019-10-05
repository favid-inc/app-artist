import { createStackNavigator } from 'react-navigation';

import { PoliciesContainer } from '@src/containers/policies';
import { TopBarNavigationOptions } from '@src/core/navigation/options';

import { AccountNavigation } from './account';
import { SettingsContainer } from './SettingsContainer';
import { WalletNavigation } from './wallet';

export const SettingsNavigator = createStackNavigator(
  {
    Configurações: SettingsContainer,
    ['Políticas']: PoliciesContainer,
    ...AccountNavigation,
    ...WalletNavigation,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: TopBarNavigationOptions,
  },
);

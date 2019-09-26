import { createStackNavigator } from 'react-navigation';

import { TopBarNavigationOptions } from '@src/core/navigation/options';
import { PoliciesContainer } from '@src/containers/policies';

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

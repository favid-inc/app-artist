import { createStackNavigator } from 'react-navigation';

import { TopBarNavigationOptions } from '@src/core/navigation/options';

import { WalletNavigation } from './wallet';
import { connect } from './context';
import { SettingsContainer } from './SettingsContainer';
import { AccountNavigation } from './account';

export const SettingsNavigator = connect(
  createStackNavigator(
    {
      Configurações: SettingsContainer,
      ...AccountNavigation,
      ...WalletNavigation,
    },
    {
      headerMode: 'screen',
      defaultNavigationOptions: TopBarNavigationOptions,
    },
  ),
);

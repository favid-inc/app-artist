import { createStackNavigator, NavigationContainer, NavigationRouteConfigMap } from 'react-navigation';
import { AccountNavigation } from './account';
import { SettingsContainer } from './SettingsContainer';

export const SettingsNavigator: NavigationContainer = createStackNavigator(
  {
    Settings: SettingsContainer,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: { header: null },
  },
);

export const SettingsNavigationMap: NavigationRouteConfigMap = {
  ...AccountNavigation,
};

import { NavigationContainer, createStackNavigator, NavigationRouteConfigMap } from 'react-navigation';
import { SettingsContainer } from './SettingsContainer';
import { AccountNavigation } from './account';

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

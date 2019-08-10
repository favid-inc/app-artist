import { NavigationContainer, createBottomTabNavigator, NavigationRouteConfigMap } from 'react-navigation';
import { MenuContainer } from './menu.container';
import { OrdersNavigator } from '../orders';
import { SettingsNavigator } from '../settings';

const menuNavigationMap: NavigationRouteConfigMap = {
  Orders: OrdersNavigator,
  Settings: SettingsNavigator,
};

export const MenuNavigator: NavigationContainer = createBottomTabNavigator(menuNavigationMap, {
  tabBarComponent: MenuContainer,
});

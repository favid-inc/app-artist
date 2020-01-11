import { createBottomTabNavigator, NavigationContainer, NavigationRouteConfigMap } from 'react-navigation';

import { OrdersNavigator } from '../orders';
import { MyOrdersNavigator } from '../myOrders';
import { SettingsNavigator } from '../settings';

import { MenuContainer } from './MenuContainer';

const menuNavigationMap: NavigationRouteConfigMap = {
  Orders: OrdersNavigator,
  MyOrders: MyOrdersNavigator,
  Settings: SettingsNavigator,
};

export const MenuNavigator: NavigationContainer = createBottomTabNavigator(menuNavigationMap, {
  tabBarComponent: MenuContainer,
});

import { NavigationContainer, createStackNavigator } from 'react-navigation';
import { RecordContainer } from './record';

export const OrdersNavigator: NavigationContainer = createStackNavigator(
  {
    record: RecordContainer,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

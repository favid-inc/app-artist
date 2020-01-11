import { createStackNavigator } from 'react-navigation';
import { MyOrdersContainer } from './MyOrdersContainer';
import { connect } from './context';

export const MyOrdersNavigator = connect(
  createStackNavigator(
    {
      'Meus Pedidos': MyOrdersContainer,
    },
    {
      headerMode: 'screen',
      defaultNavigationOptions: {
        headerTransparent: true,
      },
    },
  ),
);

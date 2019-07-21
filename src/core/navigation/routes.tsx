import React from 'react';
import { connect } from 'react-redux';
import { useScreens } from 'react-native-screens';
import {
  NavigationAction,
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator,
  NavigationContainer,
  NavigationRouteConfigMap,
  NavigationState,
} from 'react-navigation';
import { SocialNavigationOptions } from './options';

import { MenuContainer } from '@src/containers/menu';
import AccountContainer from '@src/containers/menu/account/AccountCointainer';
import SignInContainer from '@src/containers/signin/SignInContainer';
import ArtistDetailsContainer from '@src/containers/artistDetails/ArtistDetailsContainer';
import { OrdersContainer } from '@src/containers/menu/orders/OrdersContainer';
import * as BuyingProcess from '@src/containers/buyingProcess/index';
import BookingContainer from '@src/containers/buyingProcess/booking/BookingContainer';
import { DeclineOrderContainer } from '@src/containers/orders/declineOrders';
const AccountNavigator: NavigationContainer = createStackNavigator(
  {
    ['Account']: AccountContainer,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const BuyingProcessNavigationMap: NavigationRouteConfigMap = {
  ['Booking']: {
    screen: BuyingProcess.default.BookingContainer,
    navigationOptions: SocialNavigationOptions,
  },
};

const ArtistNavigationMap: NavigationRouteConfigMap = {
  ['Artist Details']: {
    screen: ArtistDetailsContainer,
    navigationOptions: SocialNavigationOptions,
  },
};

const SignInNavigator: NavigationContainer = createStackNavigator(
  {
    ['Sign In']: SignInContainer,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const ArtistsNavigator: NavigationContainer = createStackNavigator(
  {
    ['Orders']: OrdersContainer,
    ['Artists']: BookingContainer,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const MenuNavigator: NavigationContainer = createBottomTabNavigator(
  {
    ['Artists']: ArtistsNavigator,
    ['Account']: AccountNavigator,
  },
  {
    tabBarComponent: MenuContainer,
  },
);

const AppNavigator: NavigationContainer = createStackNavigator(
  {
    ['Home']: MenuNavigator,
    ...ArtistNavigationMap,
    ...BuyingProcessNavigationMap,
    DeclineOrder: DeclineOrderContainer,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const createAppRouter = (container: NavigationContainer): NavigationContainer => {
  useScreens();
  return createAppContainer(container);
};

// const NavigationRouter: NavigationContainer = createAppRouter(AppNavigator);
const NavigationRouter: NavigationContainer = createAppRouter(AppNavigator);
const AuthNavigationRouter: NavigationContainer = createAppRouter(SignInNavigator);
interface ComponentProps {
  auth: any;
  onNavigationStateChange: (
    prevNavigationState: NavigationState,
    nextNavigationState: NavigationState,
    action: NavigationAction,
  ) => void;
}

class Router extends React.Component<ComponentProps> {
  public render() {
    let navigation = <AuthNavigationRouter onNavigationStateChange={this.props.onNavigationStateChange} />;
    if (this.props.auth.authState.uid) {
      navigation = <NavigationRouter onNavigationStateChange={this.props.onNavigationStateChange} />;
    }
    return navigation;
  }
}

const mapStateToProps = ({ auth }) => ({ auth: auth });

export default connect(mapStateToProps)(Router);

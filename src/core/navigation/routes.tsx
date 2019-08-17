import React from 'react';
import { useScreens } from 'react-native-screens';
import {
  createAppContainer,
  createStackNavigator,
  NavigationAction,
  NavigationContainer,
  NavigationState,
} from 'react-navigation';

import { SignInContainer } from '@src/containers/auth/AuthContainer';
import { MenuNavigator } from '@src/containers/menu';
import { OrdersNavigator } from '@src/containers/orders';
import { AuthContext } from '@src/core/auth';

import { SettingsNavigationMap } from '../../containers/settings';

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

const AppNavigator: NavigationContainer = createStackNavigator(
  {
    ['Home']: MenuNavigator,
    OrdersNavigator,
    ...SettingsNavigationMap,
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
  onNavigationStateChange: (
    prevNavigationState: NavigationState,
    nextNavigationState: NavigationState,
    action: NavigationAction,
  ) => void;
}

export class Router extends React.Component<ComponentProps> {
  public render() {
    return (
      <AuthContext.Consumer>
        {({ isSignedIn }) =>
          isSignedIn ? (
            <NavigationRouter onNavigationStateChange={this.props.onNavigationStateChange} />
          ) : (
            <AuthNavigationRouter onNavigationStateChange={this.props.onNavigationStateChange} />
          )
        }
      </AuthContext.Consumer>
    );
  }
}

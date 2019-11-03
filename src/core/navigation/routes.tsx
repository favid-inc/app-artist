import React from 'react';
import { useScreens } from 'react-native-screens';
import {
  createAppContainer,
  createStackNavigator,
  NavigationAction,
  NavigationContainer,
  NavigationState,
} from 'react-navigation';

import { TopBarNavigationOptions } from '@src/core/navigation/options';

import { AccountContainer } from '@src/containers/account';
import { AuthContainer } from '@src/containers/auth';
import { MenuNavigator } from '@src/containers/menu';
import { OrdersNavigator } from '@src/containers/orders';
import { PoliciesContainer } from '@src/containers/policies';
import { SettingsNavigator } from '@src/containers/settings';
import { AuthContext } from '@src/core/auth';

const SignInNavigator: NavigationContainer = createStackNavigator(
  {
    ['Sign In']: AuthContainer,
    ['Políticas']: {
      screen: PoliciesContainer,
      navigationOptions: TopBarNavigationOptions,
    },
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const CreateArtistAccountNavigator = createStackNavigator(
  {
    ['Criar Conta de Artista']: AccountContainer,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: TopBarNavigationOptions,
  },
);

const AppNavigator: NavigationContainer = createStackNavigator(
  {
    ['Home']: MenuNavigator,
    OrdersNavigator,
    SettingsNavigator,
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

const NavigationRouter: NavigationContainer = createAppRouter(AppNavigator);
const AuthNavigationRouter: NavigationContainer = createAppRouter(SignInNavigator);
const CreateArtistAccountRouter: NavigationContainer = createAppRouter(CreateArtistAccountNavigator);

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
        {({ user, claims }) =>
          user ? (
            claims.artist ? (
              <NavigationRouter onNavigationStateChange={this.props.onNavigationStateChange} />
            ) : (
              <CreateArtistAccountRouter onNavigationStateChange={this.props.onNavigationStateChange} />
            )
          ) : (
            <AuthNavigationRouter onNavigationStateChange={this.props.onNavigationStateChange} />
          )
        }
      </AuthContext.Consumer>
    );
  }
}

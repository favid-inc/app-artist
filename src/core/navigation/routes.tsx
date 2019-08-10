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
import * as actions from '../../store/actions';

import { MenuNavigator } from '@src/containers/menu';
import SignInContainer from '@src/containers/signin/SignInContainer';
import ArtistDetailsContainer from '@src/containers/artistDetails/ArtistDetailsContainer';
import * as BuyingProcess from '@src/containers/buyingProcess/index';
import BookingContainer from '@src/containers/buyingProcess/booking/BookingContainer';
import { OrdersNavigator } from '@src/containers/orders';
import { Artist as ArtistModel } from '../../core/model/artist.model';
import { AuthState as AuthStateModel } from '../../core/model/authState.model';
import { SettingsNavigationMap } from '../../containers/settings';

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
    ['Orders']: OrdersNavigator,
    ['Artists']: BookingContainer,
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
    ...ArtistNavigationMap,
    ...BuyingProcessNavigationMap,
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
  artist: ArtistModel;
  authState: AuthStateModel;
  onLoadAuthState: () => void;
  onLoadArtist: () => void;
  onverifySession: (authState: AuthStateModel) => void;
  onNavigationStateChange: (
    prevNavigationState: NavigationState,
    nextNavigationState: NavigationState,
    action: NavigationAction,
  ) => void;
}

class Router extends React.Component<ComponentProps> {
  componentWillMount() {
    this.props.onLoadAuthState();
    this.props.onLoadArtist();
  }

  componentDidUpdate() {
    if (this.props.authState.refreshToken) {
      this.props.onverifySession(this.props.authState);
    }
  }
  public render() {
    let navigation = <AuthNavigationRouter onNavigationStateChange={this.props.onNavigationStateChange} />;
    if (this.props.authState.accessTokenExpirationDate) {
      navigation = <NavigationRouter onNavigationStateChange={this.props.onNavigationStateChange} />;
    }
    return navigation;
  }
}

const mapStateToProps = ({ auth, artist }) => ({ authState: auth.authState, artist: artist.artist });
const mapDispatchToProps = dispatch => ({
  onLoadAuthState: () => dispatch(actions.loadAuthState()),
  onLoadArtist: () => dispatch(actions.loadArtist()),
  onverifySession: (authState: AuthStateModel) => dispatch(actions.verifySession(authState)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Router);

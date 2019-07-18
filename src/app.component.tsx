import * as config from './core/config';
import * as core from '@favid-inc/core/lib/app';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Firestore } from '@google-cloud/firestore';

import React from 'react';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import AuthReducer from './store/reducers/AuthReducer';
import ArtistReducer from './store/reducers/ArtistReducer';
import OrderReducer from './store/reducers/OrderReducer';

import { ImageRequireSource } from 'react-native';
import { NavigationState } from 'react-navigation';
import { mapping } from '@eva-design/eva';
import { ApplicationProvider } from '@kitten/theme';
import { DynamicStatusBar } from '@src/components/common';
import { ApplicationLoader, Assets } from './core/appLoader/applicationLoader.component';
import Router from './core/navigation/routes';
import { trackScreenTransition } from './core/utils/analytics';
import { getCurrentStateName } from './core/navigation/util';
import { ThemeContext, ThemeContextType, ThemeKey, themes, ThemeStore } from '@src/core/themes';

if (!firebase.firestore) {
  throw new Error(`
    import * as firebase from 'firebase';
    import 'firebase/firestore';
  `);
}
firebase.initializeApp(config.firebase);
core.App.initialize(config.core, (firebase.firestore() as unknown) as Firestore);

const images: ImageRequireSource[] = [require('./assets/images/source/favid-logo.png'), require('./assets/images/source/google.png')];

const fonts: { [key: string]: number } = {
  'opensans-semibold': require('./assets/fonts/opensans-semibold.ttf'),
  'opensans-bold': require('./assets/fonts/opensans-bold.ttf'),
  'opensans-extrabold': require('./assets/fonts/opensans-extra-bold.ttf'),
  'opensans-light': require('./assets/fonts/opensans-light.ttf'),
  'opensans-regular': require('./assets/fonts/opensans-regular.ttf'),
};

const assets: Assets = {
  images: images,
  fonts: fonts,
};

interface State {
  theme: ThemeKey;
}

class App extends React.Component<{}, State> {
  public state: State = {
    theme: 'Eva Dark',
  };

  private onTransitionTrackError = (error: any): void => {
    console.warn('Analytics error: ', error.message);
  };

  private onNavigationStateChange = (prevState: NavigationState, currentState: NavigationState) => {
    const prevStateName: string = getCurrentStateName(prevState);
    const currentStateName: string = getCurrentStateName(currentState);

    if (prevStateName !== currentStateName) {
      trackScreenTransition(currentStateName).catch(this.onTransitionTrackError);
    }
  };

  private onSwitchTheme = (theme: ThemeKey) => {
    ThemeStore.setTheme(theme).then(() => {
      this.setState({ theme });
    });
  };

  private rootReducer = combineReducers({
    auth: AuthReducer,
    artist: ArtistReducer,
    order: OrderReducer,
  });

  private store = createStore(this.rootReducer, /* preloadedState, */ compose(applyMiddleware(thunk)));

  public render(): React.ReactNode {
    const contextValue: ThemeContextType = {
      currentTheme: this.state.theme,
      toggleTheme: this.onSwitchTheme,
    };

    return (
      <ApplicationLoader assets={assets}>
        <ThemeContext.Provider value={contextValue}>
          <Provider store={this.store}>
            <ApplicationProvider mapping={mapping} theme={themes[this.state.theme]}>
              <DynamicStatusBar currentTheme={this.state.theme} />
              <Router onNavigationStateChange={this.onNavigationStateChange} />
            </ApplicationProvider>
          </Provider>
        </ThemeContext.Provider>
      </ApplicationLoader>
    );
  }
}

export default App;

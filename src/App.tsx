import * as firebase from 'firebase';
import * as config from './core/config';
firebase.initializeApp(config.firebase);

import { mapping } from '@eva-design/eva';
import { ApplicationProvider } from '@kitten/theme';
import { Router } from '@src/core/navigation/routes';
import React from 'react';
import { ImageRequireSource } from 'react-native';
import { NavigationState } from 'react-navigation';

// import { getCurrentStateName } from '@src/core/navigation/util';
// import { trackScreenTransition } from '@src/core/utils/analytics';
import { ApplicationLoader, Assets } from '@src/core/appLoader/applicationLoader.component';
import { FirebaseAuth } from '@src/core/auth';
import { apiClient } from '@src/core/utils/apiClient';

import { DynamicStatusBar } from '@src/components/common';
import { ThemeContext, ThemeContextType, ThemeKey, themes, ThemeStore } from '@src/core/themes';

const images: ImageRequireSource[] = [require('./assets/images/source/favid-logo.png')];

const fonts: { [key: string]: number } = {
  'opensans-semibold': require('./assets/fonts/opensans-semibold.ttf'),
  'opensans-bold': require('./assets/fonts/opensans-bold.ttf'),
  'opensans-extrabold': require('./assets/fonts/opensans-extra-bold.ttf'),
  'opensans-light': require('./assets/fonts/opensans-light.ttf'),
  'opensans-regular': require('./assets/fonts/opensans-regular.ttf'),
};

const assets: Assets = {
  images,
  fonts,
};

interface State {
  theme: ThemeKey;
}

apiClient.interceptors.request.use(async (axiosRequestConfig) => {
  const headers = { Authorization: '' };

  try {
    const idToken = await firebase.auth().currentUser.getIdToken();
    Object.assign(headers, axiosRequestConfig.headers, { Authorization: `Bearer ${idToken}` });
  } finally {
    axiosRequestConfig.headers = headers;
  }

  return axiosRequestConfig;
});

export class App extends React.Component<{}, State> {
  public state: State = {
    theme: 'Eva Dark',
  };

  public render() {
    const contextValue: ThemeContextType = {
      currentTheme: this.state.theme,
      toggleTheme: this.onSwitchTheme,
    };

    return (
      <ApplicationLoader assets={assets}>
        <ThemeContext.Provider value={contextValue}>
          <ApplicationProvider mapping={mapping} theme={themes[this.state.theme]}>
            <DynamicStatusBar currentTheme={this.state.theme} />
            <FirebaseAuth>
              <Router onNavigationStateChange={this.onNavigationStateChange} />
            </FirebaseAuth>
          </ApplicationProvider>
        </ThemeContext.Provider>
      </ApplicationLoader>
    );
  }

  // private onTransitionTrackError = (error: any): void => {
  //   console.warn('Analytics error: ', error.message);
  // };

  private onNavigationStateChange = (prevState: NavigationState, currentState: NavigationState) => {
    // const prevStateName: string = getCurrentStateName(prevState);
    // const currentStateName: string = getCurrentStateName(currentState);
    // if (prevStateName !== currentStateName) {
    //   trackScreenTransition(currentStateName).catch(this.onTransitionTrackError);
    // }
  };

  private onSwitchTheme = (theme: ThemeKey) => {
    ThemeStore.setTheme(theme).then(() => {
      this.setState({ theme });
    });
  };
}

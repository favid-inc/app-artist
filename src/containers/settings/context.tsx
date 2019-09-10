import React from 'react';
import { NavigationContainer, NavigationScreenProps } from 'react-navigation';

import { LoadWalletInfo } from '@favid-inc/api/lib/app-artist';

type WalletInfo = LoadWalletInfo['Response'];

interface Context {
  walletInfo?: WalletInfo;
  setWalletInfo?: (w: WalletInfo) => void;
}

export const SettingsContext = React.createContext<Context>({});

type State = Context;

export function connect(Navigator: NavigationContainer) {
  class ContextNavigator extends React.Component<NavigationScreenProps, State> {
    static router = Navigator.router;
    static screenProps = Navigator.screenProps;
    static navigationOptions = Navigator.navigationOptions;

    public state: State = {
      setWalletInfo: (walletInfo: WalletInfo) => {
        this.setState({ walletInfo });
      },
    };

    public render() {
      return (
        <SettingsContext.Provider value={this.state}>
          <SettingsContext.Consumer>{() => <Navigator {...this.props} />}</SettingsContext.Consumer>
        </SettingsContext.Provider>
      );
    }
  }

  return ContextNavigator;
}

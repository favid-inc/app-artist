import React from 'react';
import { View } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from 'react-native-ui-kitten/theme';
import { NavigationScreenProps } from 'react-navigation';
import { Wallet } from './Wallet';
type Props = ThemedComponentProps & NavigationScreenProps;

import { SettingsContext } from '../context';

class WalletContainerComponent extends React.Component<Props> {
  static contextType = SettingsContext;
  public context: React.ContextType<typeof SettingsContext>;
  public render() {
    return (
      <View style={this.props.themedStyle.container}>
        <Wallet onNavigate={this.onNavigate} />
      </View>
    );
  }
  private onNavigate = (pathName: string): void => {
    this.props.navigation.navigate(pathName);
  };
}

export const WalletContainer = withStyles(WalletContainerComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
}));

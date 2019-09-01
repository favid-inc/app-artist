import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { ScrollView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Wallet } from './Wallet';
type Props = ThemedComponentProps & NavigationScreenProps;

class WalletContainerComponent extends React.Component<Props> {
  public render() {
    return (
      <ScrollView style={this.props.themedStyle.container}>
        <Wallet onNavigate={this.onNavigate} />
      </ScrollView>
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

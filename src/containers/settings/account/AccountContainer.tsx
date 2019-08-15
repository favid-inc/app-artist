import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { Account } from './Account';

type Props = ThemedComponentProps & NavigationScreenProps;

class AccountContainerComponent extends React.Component<Props> {
  public render() {
    return (
      <View style={this.props.themedStyle.container}>
        <Account />
      </View>
    );
  }
}

export const AccountContainer = withStyles(AccountContainerComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
}));

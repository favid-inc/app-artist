import React from 'react';
import { View } from 'react-native';
import {} from './MyWallet';
type Props = ThemedComponentProps & NavigationScreenProps;

class AccountContainerComponent extends React.Component<Props> {
  public render() {
    return (
      <View style={this.props.themedStyle.container}>
        <MyWallet />
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

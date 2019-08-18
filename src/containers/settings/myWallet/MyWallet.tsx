import React from 'react';
import { Text } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from 'react-native-ui-kitten/theme';

export type Props = ThemedComponentProps;
interface State {}

class MyWalletComponent extends React.Component<Props, State> {
  public state: State = {};

  public render() {
    return <Text>My Wallet</Text>;
  }
}

export const Account = withStyles(MyWalletComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
}));

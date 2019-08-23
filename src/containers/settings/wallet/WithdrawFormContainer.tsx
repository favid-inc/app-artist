import React from 'react';
import { View } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { NavigationScreenProps } from 'react-navigation';
import { WithdrawForm } from './WithdrawForm';

type Props = ThemedComponentProps & NavigationScreenProps;

class WithdrawFormContainerComponent extends React.Component<Props> {
  public render() {
    return (
      <View style={this.props.themedStyle.container}>
        <WithdrawForm onDone={this.handleOnDone} />
      </View>
    );
  }
  private handleOnDone = () => {
    this.props.navigation.goBack();
  };
}

export const WithdrawFormContainer = withStyles(WithdrawFormContainerComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
}));

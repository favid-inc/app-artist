import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationScreenProps, NavigationEventSubscription } from 'react-navigation';
import { RecordOrderVideo } from './RecordOrderVideo';

interface State {
  didFocusSubscription?: NavigationEventSubscription;
  didBlurSubscription?: NavigationEventSubscription;
  isFocused?: boolean;
}
export class RecordOrderVideoContainer extends Component<NavigationScreenProps, State> {
  public state = {
    didFocusSubscription: null,
    didBlurSubscription: null,
    isFocused: false,
  };

  private onRecordDone = () => this.props.navigation.navigate('PlayOrderVideo');

  public componentDidMount = () => {
    const { navigation } = this.props;
    this.setState({
      didFocusSubscription: navigation.addListener('didFocus', () => this.setState({ isFocused: true })),
      didBlurSubscription: navigation.addListener('didBlur', () => this.setState({ isFocused: false })),
    });
  };

  public componentWillUnmount = () => {
    const { didFocusSubscription, didBlurSubscription } = this.state;
    didFocusSubscription && didFocusSubscription.remove();
    didBlurSubscription && didBlurSubscription.remove();
  };

  public render() {
    if (!this.state.isFocused) {
      return <View />;
    }
    return <RecordOrderVideo onDone={this.onRecordDone} />;
  }
}

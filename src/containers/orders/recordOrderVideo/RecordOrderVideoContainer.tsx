import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationEventSubscription, NavigationScreenProps } from 'react-navigation';

import { RecordOrderVideo } from './RecordOrderVideo';

interface State {
  isFocused: boolean;
}

export class RecordOrderVideoContainer extends Component<NavigationScreenProps, State> {
  private didFocusSubscription: NavigationEventSubscription;
  private didBlurSubscription: NavigationEventSubscription;

  public componentDidMount() {
    const { navigation } = this.props;
    this.didFocusSubscription = navigation.addListener('didFocus', () => this.setState({ isFocused: true }));
    this.didBlurSubscription = navigation.addListener('didBlur', () => this.setState({ isFocused: false }));
  }

  public componentWillUnmount() {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
    }

    if (this.didBlurSubscription) {
      this.didBlurSubscription.remove();
    }
  }

  public render() {
    if (!this.state.isFocused) {
      return <View />;
    }
    return <RecordOrderVideo onDone={this.handleRecordDone} />;
  }

  private handleRecordDone = () => this.props.navigation.navigate('PlayOrderVideo');
}

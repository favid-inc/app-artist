import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationEventSubscription, NavigationScreenProps } from 'react-navigation';

import { PlayOrderVideo } from './PlayOrderVideo';

interface State {
  isFocused?: boolean;
}

export class PlayOrderVideoContainer extends Component<NavigationScreenProps, State> {
  public state: State = {
    isFocused: false,
  };

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
    return <PlayOrderVideo onRedo={this.handleOnRedo} onUpload={this.handleOnUpload} />;
  }

  private handleOnRedo = () => {
    this.props.navigation.goBack();
  };

  private handleOnUpload = () => {
    this.props.navigation.push('UploadOrderVideo');
  };
}

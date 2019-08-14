import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationEventSubscription, NavigationScreenProps } from 'react-navigation';

import { PlayOrderVideo } from './PlayOrderVideo';

interface State {
  didFocusSubscription?: NavigationEventSubscription;
  didBlurSubscription?: NavigationEventSubscription;
  isFocused?: boolean;
}

export class PlayOrderVideoContainer extends Component<NavigationScreenProps, State> {
  public state: State = {
    didFocusSubscription: null,
    didBlurSubscription: null,
    isFocused: false,
  };

  public componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      didFocusSubscription: navigation.addListener('didFocus', () => this.setState({ isFocused: true })),
      didBlurSubscription: navigation.addListener('didBlur', () => this.setState({ isFocused: false })),
    });
  }

  public componentWillUnmount() {
    const { didFocusSubscription, didBlurSubscription } = this.state;

    if (didFocusSubscription) {
      didFocusSubscription.remove();
    }
    if (didBlurSubscription) {
      didBlurSubscription.remove();
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

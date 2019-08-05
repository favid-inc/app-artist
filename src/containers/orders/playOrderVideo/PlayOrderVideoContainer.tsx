import React, { Component } from 'react';
import { NavigationScreenProps, NavigationEventSubscription } from 'react-navigation';
import { View } from 'react-native';
import { PlayOrderVideo } from './PlayOrderVideo';

interface State {
  didFocusSubscription?: NavigationEventSubscription;
  didBlurSubscription?: NavigationEventSubscription;
  isFocused?: boolean;
}

export class PlayOrderVideoContainer extends Component<NavigationScreenProps, State> {
  public state = {
    didFocusSubscription: null,
    didBlurSubscription: null,
    isFocused: false,
  };

  private handleOnRedo = () => {
    this.props.navigation.goBack();
  };

  private handleOnUpload = () => {
    this.props.navigation.push('UploadOrderVideo');
  };

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
    return <PlayOrderVideo onRedo={this.handleOnRedo} onUpload={this.handleOnUpload} />;
  }
}

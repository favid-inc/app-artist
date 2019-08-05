import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { PlayOrderVideo } from './PlayOrderVideo';

export class PlayOrderVideoContainer extends Component<NavigationScreenProps> {
  private handleOnRedo = () => {
    this.props.navigation.goBack();
  };

  private handleOnUpload = () => {
    this.props.navigation.push('UploadOrderVideo');
  };

  public render() {
    return <PlayOrderVideo onRedo={this.handleOnRedo} onUpload={this.handleOnUpload} />;
  }
}

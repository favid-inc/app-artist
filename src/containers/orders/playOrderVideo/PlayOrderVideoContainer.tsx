import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { PlayOrderVideo } from './PlayOrderVideo';

export class PlayOrderVideoContainer extends Component<NavigationScreenProps> {
  private handleOnRedo = () => {
    this.props.navigation.push('RecordOrderVideo');
  };

  private handleOnUpload = () => {
    this.props.navigation.goBack();
  };

  public render(): React.ReactNode {
    return <PlayOrderVideo onRedo={this.handleOnRedo} onUpload={this.handleOnUpload} />;
  }
}

import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { UploadOrderVideo } from './UploadOrderVideo';

export class UploadOrderVideoContainer extends Component<NavigationScreenProps> {
  public render() {
    return <UploadOrderVideo onDone={this.handleOnDone} />;
  }
  private handleOnDone = () => {
    this.props.navigation.navigate('SelectOrder');
  };
}

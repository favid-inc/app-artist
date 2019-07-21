import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { PlayOrderVideo } from './PlayOrderVideo';

export class PlayOrderVideoContainer extends Component<NavigationScreenProps> {
  public render(): React.ReactNode {
    return <PlayOrderVideo />;
  }
}

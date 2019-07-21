import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { RecordOrderVideo } from './RecordOrderVideo';

interface Props {
  onRecord: () => any;
}

export class RecordOrderVideoContainer extends Component<NavigationScreenProps> {
  onRecordDone = () => this.props.navigation.push('Play');

  public render() {
    return (
        <RecordOrderVideo onDone={this.onRecordDone} />
    );
  }
}

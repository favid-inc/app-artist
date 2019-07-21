import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Record } from './Record';

interface Props {
  onRecord: () => any;
}

export class RecordContainer extends Component<NavigationScreenProps> {
  onRecordDone = () => this.props.navigation.push('Play');

  public render() {
    return (
        <Record onDone={this.onRecordDone} />
    );
  }
}

import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Record } from './Record';


export class RecordContainer extends Component<NavigationScreenProps> {
  public render() {
    return <Record />;
  }
}

import React, { Component } from 'react';
import { Camera } from 'expo-camera';

export class Record extends Component {
  public render(): React.ReactNode {
    return <Camera />;
  }
}

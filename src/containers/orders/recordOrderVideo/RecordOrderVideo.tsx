import React, { Component } from 'react';
import { Camera } from './Camera';

interface Props {
  onDone: () => void;
}

export class RecordOrderVideo extends Component<Props> {
  onCameraRecord = (uri) => {
    console.log(uri);
    this.props.onDone();
  }

  public render(): React.ReactNode {
    return <Camera onRecord={this.onCameraRecord} />;
  }
}

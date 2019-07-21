import React, { Component } from 'react';
import { Text, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera as NativeCamera } from 'expo-camera';
import { BottomBar } from './bottomBar';

const Type = NativeCamera.Constants.Type;

interface Props {
  onRecord: () => any;
}

interface State {
  hasPermission: boolean;
  isRecording: boolean;
  type: any;
}

export class Camera extends Component<Props, State> {
  private camera: NativeCamera;

  public state = {
    hasPermission: null,
    type: NativeCamera.Constants.Type.back,
    isRecording: false,
  };

  private setCamera = camera => (this.camera = camera);

  private startRecording = async () => void this.camera.recordAsync();
  private stopRecording = () => void this.camera.stopRecording();
  private flipCamera = () =>
    this.setState({
      type: this.state.type === Type.back ? Type.front : Type.back,
    });

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  }

  render() {
    const { hasPermission } = this.state;

    if (hasPermission === null) {
      return <View />;
    }

    if (!hasPermission) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={{ flex: 1 }}>
        <NativeCamera
          ref={this.setCamera}
          style={{ flex: 1 }}
          type={this.state.type}
        >
          <BottomBar
            mode='recording'
            onFlip={this.flipCamera}
            onRecord={this.startRecording}
            onStop={this.stopRecording}
          />
        </NativeCamera>
      </View>
    );
  }
}

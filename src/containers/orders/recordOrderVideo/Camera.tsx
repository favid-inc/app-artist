import { Camera as NativeCamera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import React, { Component } from 'react';
import { Platform, Text, View } from 'react-native';
import { captureRef as takeSnapshotAsync } from 'react-native-view-shot';

import { Toolbar } from './toolbar';

const CameraType = NativeCamera.Constants.Type;
const FlashMode = NativeCamera.Constants.FlashMode;

interface Props {
  onRecord: (videoUri: string, videoThumbnailUri: string) => any;
}

interface State {
  cameraType: any;
  flashMode: any;
  hasPermission: boolean;
  isCapturing: boolean;
  ratio: string;
}

const DESIRED_RATIO = '16:9';

export class Camera extends Component<Props, State> {
  public state: State = {
    cameraType: CameraType.front,
    flashMode: FlashMode.off,
    hasPermission: null,
    isCapturing: false,
    ratio: DESIRED_RATIO,
  };

  private camera: NativeCamera;

  public async componentDidMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    const hasPermission = `${camera.status}${audio.status}` === 'grantedgranted';

    this.setState({ hasPermission });
  }

  public render() {
    const { hasPermission } = this.state;

    if (hasPermission === null) {
      return <View />;
    }

    if (!hasPermission) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <NativeCamera
          ref={this.setCamera}
          style={{ flex: 1 }}
          type={this.state.cameraType}
          flashMode={this.state.flashMode}
          onCameraReady={this.prepareRatio}
          ratio={this.state.ratio}
        />
        <Toolbar
          cameraType={this.state.cameraType}
          flashMode={this.state.flashMode}
          isCapturing={this.state.isCapturing}
          onCaptureIn={this.handleCaptureIn}
          onCaptureOut={this.handleCaptureOut}
          toggleCameraType={this.handleToggleCameraType}
          toggleFlashMode={this.handleToggleFlashMode}
        />
      </View>
    );
  }

  private handleToggleCameraType = () =>
    this.setState({ cameraType: this.state.cameraType === CameraType.front ? CameraType.back : CameraType.front });

  private handleToggleFlashMode = () =>
    this.setState({ flashMode: this.state.flashMode === FlashMode.off ? FlashMode.on : FlashMode.off });

  private setCamera = (camera) => (this.camera = camera);

  private async prepareRatio() {
    if (Platform.OS === 'android' && this.camera) {
      const ratios = await this.camera.getSupportedRatiosAsync();

      // See if the current device has your desired ratio, otherwise get the maximum supported one
      // Usually the last element of "ratios" is the maximum supported ratio
      const ratio = ratios.find((r) => r === DESIRED_RATIO) || ratios[ratios.length - 1];

      this.setState({ ratio });
    }
  }

  private handleCaptureIn = async () => {
    const start = Date.now();

    this.setState({ isCapturing: true });

    const { uri: videoUri } = await this.camera.recordAsync({ quality: NativeCamera.Constants.VideoQuality['4:3'] });

    this.setState({ isCapturing: false });

    const end = Date.now();

    if (end - start < 1000) {
      return;
    }

    const videoThumbnailUri = await takeSnapshotAsync(this.camera);

    this.props.onRecord(videoUri, videoThumbnailUri);
  };

  private handleCaptureOut = () => {
    this.setState({ isCapturing: false });
    this.camera.stopRecording();
  };
}

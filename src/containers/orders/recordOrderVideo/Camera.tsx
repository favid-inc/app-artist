import React, { Component } from 'react';
import { Text, View, Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera as NativeCamera } from 'expo-camera';
import { Toolbar } from './toolbar';

const CameraType = NativeCamera.Constants.Type;
const FlashMode = NativeCamera.Constants.FlashMode;

interface Props {
  onRecord: (uri: string) => any;
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
  private camera: NativeCamera;

  public state = {
    cameraType: CameraType.front,
    flashMode: FlashMode.off,
    hasPermission: null,
    isCapturing: false,
    ratio: DESIRED_RATIO,
  };

  private setCamera = camera => (this.camera = camera);

  private prepareRatio = async () => {
    if (Platform.OS === 'android' && this.camera) {
      const ratios = await this.camera.getSupportedRatiosAsync();

      // See if the current device has your desired ratio, otherwise get the maximum supported one
      // Usually the last element of "ratios" is the maximum supported ratio
      const ratio = ratios.find(r => r === DESIRED_RATIO) || ratios[ratios.length - 1];

      this.setState({ ratio });
    }
  };

  private handleCaptureIn = async () => {
    const start = Date.now();

    this.setState({ isCapturing: true });
    const result = await this.camera.recordAsync({ quality: NativeCamera.Constants.VideoQuality['480p'] });

    this.setState({
      isCapturing: false,
    });

    const end = Date.now();

    if (end - start < 1000) {
      return;
    }
    this.props.onRecord(result.uri);
  };

  private handleCaptureOut = () => {
    this.setState({ isCapturing: false });
    this.camera.stopRecording();
  };

  handleToggleCameraType = () =>
    this.setState({ cameraType: this.state.cameraType === CameraType.front ? CameraType.back : CameraType.front });

  handleToggleFlashMode = () =>
    this.setState({ flashMode: this.state.flashMode === FlashMode.off ? FlashMode.on : FlashMode.off });

  async componentDidMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    const hasPermission = camera.status + audio.status === 'grantedgranted';

    this.setState({ hasPermission });
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
}

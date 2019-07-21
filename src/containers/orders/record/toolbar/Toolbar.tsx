import React, { useContext } from 'react';
import { View, TouchableOpacity, Image, GestureResponderEvent, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { styles } from './styles';
import { FlashMode } from '../Camera';

type EventHandler = (event: GestureResponderEvent) => void;

interface Props {
  cameraType: any;
  flashMode: any;
  isCapturing: boolean;
  onCaptureIn: EventHandler;
  onCaptureOut: EventHandler;
  toggleCameraType: EventHandler;
  toggleFlashMode: EventHandler;
}
export function Toolbar(props: Props) {
  return (
    <View style={styles.toolbar}>
      <Row>
        <Col>
          {!props.isCapturing && <FlashModeButton flashMode={props.flashMode} onPress={props.toggleFlashMode} />}
        </Col>
        <Col>
          <CaptureButton
            isCapturing={props.isCapturing}
            onPressIn={props.onCaptureIn}
            onPressOut={props.onCaptureOut}
          />
        </Col>
        <Col>
        {!props.isCapturing && <CameraTypeButton onPress={props.toggleCameraType} />}
        </Col>
      </Row>
    </View>
  );
}

const Row = ({ children }) => <View style={styles.row}>{children}</View>;

const Col = ({ children }) => <View style={styles.col}>{children}</View>;

const CameraTypeButton = ({ ...props }) => (
  <TouchableOpacity style={styles.button} {...props}>
    <Image style={styles.buttonIcon} source={require('./toggle-camera-type.png')} />
  </TouchableOpacity>
);

const CaptureButton = ({ isCapturing, ...props }) => (
  <TouchableWithoutFeedback style={!isCapturing ? styles.captureButton : styles.captureButtonActive} {...props}>
    {isCapturing && <View style={styles.captureButtonInternal} />}
  </TouchableWithoutFeedback>
);

const FlashModeButton = ({ flashMode, ...props }) => (
  <TouchableOpacity style={styles.button} {...props}>
    <Image style={styles.buttonIcon} source={flashMode === FlashMode.on ? require('./flash-mode-on.png') : require('./flash-mode-off.png')} />
  </TouchableOpacity>
);

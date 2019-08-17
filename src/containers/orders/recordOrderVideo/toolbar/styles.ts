import { Dimensions, StyleSheet } from 'react-native';

const { width: winWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // root element
  toolbar: {
    width: winWidth,
    position: 'absolute',
    height: 80,
    bottom: 20,
  },

  // Grid system
  col: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  row: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  // buttons
  button: {
    height: 60,
    width: 60,
  },

  buttonIcon: {
    flex: 1,
    height: 60,
    width: 60,
  },

  // CaptureButton
  captureButton: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 80,
    borderColor: 'white',
  },
  captureButtonActive: {
    width: 100,
    height: 100,
  },
  captureButtonInternal: {
    width: 96,
    height: 96,
    borderWidth: 2,
    borderRadius: 96,
    backgroundColor: 'red',
    borderColor: 'transparent',
  },
});

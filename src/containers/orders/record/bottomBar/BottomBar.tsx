import React, { useContext } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  GestureResponderEvent,
} from 'react-native';
import { Camera } from 'expo-camera';

type EventHandler = (event: GestureResponderEvent) => void;

interface Props {
  mode: 'recording' | 'stopped';
  onFlip: EventHandler;
  onRecord: EventHandler;
  onStop: EventHandler;
}
export function BottomBar(props: Props) {
  return (
    <View
      style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}
    >
      {props.mode === 'stopped' && <FlipButton onPress={props.onFlip} />}
      {props.mode === 'stopped' && <RecordButton onPress={props.onRecord} />}
      {props.mode === 'recording' && <StopButton onPress={props.onStop} />}
    </View>
  );
}

const FlipButton = ({ onPress }) => (
  <TouchableOpacity
    style={{ flex: 0.1, alignSelf: 'flex-end', alignItems: 'center' }}
    onPress={onPress}
  >
    <Image source={require('./flip.png')} />
  </TouchableOpacity>
);

const RecordButton = ({ onPress }) => (
  <TouchableOpacity
    style={{ flex: 0.1, alignSelf: 'flex-end', alignItems: 'center' }}
    onPress={onPress}
  >
    <Image source={require('./record.png')} />
  </TouchableOpacity>
);

const StopButton = ({ onPress }) => (
  <TouchableOpacity
    style={{ flex: 0.1, alignSelf: 'flex-end', alignItems: 'center' }}
    onPress={onPress}
  >
    <Image source={require('./stop.png')} />
  </TouchableOpacity>
);

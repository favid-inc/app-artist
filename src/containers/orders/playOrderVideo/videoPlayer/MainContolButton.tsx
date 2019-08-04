import { PlaybackStatus, PlaybackStatusToSet } from 'expo-av/build/AV';
import React, { useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View, GestureResponderEvent, TouchableOpacity } from 'react-native';

interface Props {
  playbackStatus: PlaybackStatus | null;
  setPlaybackStatusAsync: (playbackStatus: PlaybackStatusToSet) => void;
}

export const MainControlButton = (props: Props) => {
  const { playbackStatus, setPlaybackStatusAsync } = props;

  const toggleShouldPlay = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();
      if (playbackStatus.isLoaded) {
        setPlaybackStatusAsync({
          shouldPlay: !playbackStatus.shouldPlay,
        });
      }
    },
    [setPlaybackStatusAsync, playbackStatus],
  );

  if (!playbackStatus.isLoaded) {
    return <View />;
  }

  return (
    <TouchableOpacity onPress={toggleShouldPlay}>
      {playbackStatus.shouldPlay ? <PauseIcon /> : <PlayIcon />}
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  iconStyle: {
    textAlign: 'center',
  },
});

const ICON_COLOR = '#FFF';
const CENTER_ICON_SIZE = 36;

const PlayIcon = () => (
  <MaterialIcons name='play-arrow' size={CENTER_ICON_SIZE} color={ICON_COLOR} style={style.iconStyle} />
);

const PauseIcon = () => (
  <MaterialIcons name='pause' size={CENTER_ICON_SIZE} color={ICON_COLOR} style={style.iconStyle} />
);

// const Spinner = () => <ActivityIndicator color={ICON_COLOR} size='large' />;

// const ReplayIcon = () => (
//   <MaterialIcons name='replay' size={CENTER_ICON_SIZE} color={ICON_COLOR} style={style.iconStyle} />
// );

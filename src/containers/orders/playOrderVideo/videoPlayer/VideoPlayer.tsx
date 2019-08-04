import { Audio, Video } from 'expo-av';
import { PlaybackStatus, PlaybackStatusToSet } from 'expo-av/build/AV';

import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated, ActivityIndicator } from 'react-native';
import { MainControlButton } from './MainContolButton';
import { Fade } from './Fade';

interface Props {
  uri: string;
}

interface State {
  playbackStatus: PlaybackStatus;
  isShowingControls: boolean;
}

export class VideoPlayer extends React.Component<Props, State> {
  private playbackInstance: Video | null = null;

  public state: State = {
    playbackStatus: { isLoaded: false },
    isShowingControls: true,
  };

  public async componentDidMount() {
    await setAudioMode();
  }

  private toggleControls = () => {
    if (!this.state.playbackStatus.isLoaded) {
      return;
    }
    this.setState({ isShowingControls: !this.state.isShowingControls });
  };

  private setPlaybackStatusAsync = (playbackStatus: PlaybackStatusToSet) => {
    this.playbackInstance.setStatusAsync(playbackStatus);
  };

  private handlePlaybackStatusUpdate = (playbackStatus: PlaybackStatus) => {
    this.setState({ playbackStatus });
  };

  private setPlaybackInstance = (playbackInstance: Video) => {
    this.playbackInstance = playbackInstance;
  };

  public render(): React.ReactNode {
    const { uri } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.toggleControls}>
        <View style={styles.container}>
          <Video
            onPlaybackStatusUpdate={this.handlePlaybackStatusUpdate}
            ref={this.setPlaybackInstance}
            shouldPlay={true}
            source={{ uri }}
            style={styles.fullScreen}
          />
          <View style={styles.fullScreen}>
            {this.state.playbackStatus.isLoaded ? (
              <Fade visible={this.state.isShowingControls}>
                <MainControlButton
                  setPlaybackStatusAsync={this.setPlaybackStatusAsync}
                  playbackStatus={this.state.playbackStatus}
                />
              </Fade>
            ) : (
              <LoadingIndicator />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const LoadingIndicator = () => <ActivityIndicator size='large' />;

function setAudioMode() {
  return Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
    playsInSilentModeIOS: true,
    playThroughEarpieceAndroid: false,
    shouldDuckAndroid: true,
    staysActiveInBackground: false,
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullScreen: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

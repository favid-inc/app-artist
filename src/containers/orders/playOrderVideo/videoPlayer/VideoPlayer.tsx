import { Audio, Video } from 'expo-av';
import { PlaybackStatus, PlaybackStatusToSet } from 'expo-av/build/AV';
import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { Fade } from './Fade';
import { MainControlButton } from './MainContolButton';

interface Props {
  uri: string;
}

interface State {
  playbackStatus: PlaybackStatus;
  isShowingControls: boolean;
}

export class VideoPlayer extends React.Component<Props, State> {
  public state: State = {
    playbackStatus: { isLoaded: false },
    isShowingControls: true,
  };

  private playbackInstance: Video | null = null;

  public async componentDidMount() {
    await setAudioMode();
  }

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
            useNativeControls={true}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            isLooping={true}
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
    width: Dimensions.get('window').width,
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

import { Artist } from '@favid-inc/api';
import { ThemeType, withStyles } from '@kitten/theme';
import { AvatarProps, Button, Text } from '@kitten/ui';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Audio, Video } from 'expo-av';
import React from 'react';
import { Dimensions, ActivityIndicator, Alert, View } from 'react-native';
import { VideoIcon } from '@src/assets/icons';

import { Canceler, CancelToken, uploadProfileVideo } from './uploadProfileVideo';

interface ComponentProps {
  artist: Artist;
  onChange: (string) => void;
}

interface State {
  isUploading: boolean;
  uploadPercentage: number;
}

type Props = ComponentProps & AvatarProps;

class PresentationVideoComponent extends React.Component<Props, State> {
  public state: State = {
    isUploading: false,
    uploadPercentage: 0,
  };

  private uploadCanceler: Canceler;
  private isLive: boolean = true;

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false,
      shouldDuckAndroid: true,
      staysActiveInBackground: false,
    });
  }

  public componentWillUnmount() {
    this.isLive = false;
    if (this.uploadCanceler) {
      this.uploadCanceler();
    }
  }

  public render() {
    const { themedStyle } = this.props;
    const { isUploading, uploadPercentage } = this.state;

    return (
      <View style={themedStyle.container}>
        <Video
          shouldPlay={false}
          source={{ uri: this.props.artist.videoUri }}
          style={themedStyle.video}
          useNativeControls={true}
          resizeMode={Video.RESIZE_MODE_CONTAIN}
        />
        <View>
          <Button
            activeOpacity={0.95}
            disabled={isUploading}
            icon={!isUploading && VideoIcon}
            onPress={this.handlePickerPress}
          >
            {isUploading && `${Math.round(uploadPercentage)}%`}
          </Button>
        </View>
      </View>
    );
  }

  private handlePickerPress = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status !== 'granted') {
      Alert.alert('Desculpe, precisamos de permissão para essa ação');
    }

    if (this.isLive) {
      this.setState({ isUploading: true, uploadPercentage: 0 });
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      allowsMultipleSelection: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    try {
      if (result.cancelled === false /* Typescrypt fault */) {
        const cancelToken = new CancelToken((canceler) => {
          if (this.isLive) {
            this.uploadCanceler = canceler;
          }
        });

        const { videoUri } = await uploadProfileVideo(result.uri, cancelToken, (uploadPercentage) => {
          if (this.isLive) {
            this.setState({ uploadPercentage });
          }
        });

        this.props.onChange(videoUri);
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar o vídeo. Verifique sua conexão e tente novamente.');
    } finally {
      if (this.isLive) {
        this.setState({ isUploading: false });
      }
    }
  };
}

export const PresentationVideo = withStyles<ComponentProps>(PresentationVideoComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    flex: 1,
    height: Dimensions.get('window').height * 0.5,
  },
  edit: {
    height: 48,
    borderColor: theme['border-basic-color-4'],
    backgroundColor: theme['background-basic-color-4'],
  },
}));

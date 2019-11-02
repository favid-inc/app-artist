import { Artist } from '@favid-inc/api';
import { ThemeType, withStyles } from '@kitten/theme';
import { AvatarProps, Button } from '@kitten/ui';
import { Audio, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React from 'react';
import { Alert, Dimensions, View } from 'react-native';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';

import { VideoIcon, CameraIconFill, GridIconOutline } from '@src/assets/icons';
import { Canceler, CancelToken, uploadProfileVideo } from './uploadProfileVideo';

interface ComponentProps {
  artist: Artist;
  onChange: (string) => void;
}

interface State {
  uploadPercentage: number;
  isUploading: boolean;
  isModalVisible: boolean;
  pickerSource: 'camera' | 'gallery' | null;
}

type Props = ComponentProps & AvatarProps;

class PresentationVideoComponent extends React.Component<Props, State> {
  public state: State = {
    uploadPercentage: 0,
    isUploading: false,
    isModalVisible: false,
    pickerSource: null,
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
            onPress={this.handleModalShow}
          >
            {isUploading && `${Math.round(uploadPercentage)}%`}
          </Button>
        </View>
        <Modal
          isVisible={this.state.isModalVisible}
          onBackButtonPress={this.hideModal}
          onBackdropPress={this.hideModal}
          onModalHide={this.handleModalHide}
          style={themedStyle.modal}
        >
          <View style={themedStyle.modalContent}>
            <Button icon={CameraIconFill} onPress={this.handleCameraButtonPress} size='giant' appearance='ghost'>
              Camera
            </Button>
            <Button icon={GridIconOutline} onPress={this.handleGalleryButtonPress} size='giant' appearance='ghost'>
              Galeria
            </Button>
          </View>
        </Modal>
      </View>
    );
  }

  private showModal = () => this.setState({ isModalVisible: true });
  private hideModal = () => this.setState({ isModalVisible: false });

  private handleModalShow = () => {
    this.setState({ pickerSource: null });
    this.showModal();
  };
  private handleModalHide = () => {
    const { pickerSource } = this.state;
    if (pickerSource) {
      this.uploadMedia(pickerSource);
    }
  };

  private handleCameraButtonPress = () => {
    this.setState({ pickerSource: 'camera' });
    this.hideModal();
  };

  private handleGalleryButtonPress = () => {
    this.setState({ pickerSource: 'gallery' });
    this.hideModal();
  };

  private uploadMedia = async (source: 'camera' | 'gallery') => {
    try {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (status !== 'granted') {
          Alert.alert('Desculpe, precisamos de permissão para essa ação');
          return;
        }
      }

      if (this.isLive) {
        this.setState({ isUploading: true, uploadPercentage: 0 });
      }

      const imagePickerOptions: ImagePicker.ImagePickerOptions = {
        allowsEditing: true,
        quality: 0,
        allowsMultipleSelection: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      };

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync(imagePickerOptions)
          : await ImagePicker.launchImageLibraryAsync(imagePickerOptions);

      if (result.cancelled === false) {
        const cancelToken: CancelToken = (canceler) => {
          this.uploadCanceler = canceler;
        };

        const { videoUri } = await uploadProfileVideo(result.uri, cancelToken, (uploadPercentage) => {
          if (this.isLive) {
            this.setState({ uploadPercentage });
          }
        });

        this.props.onChange(videoUri);
      }
    } catch (e) {
      Alert.alert('Erro', 'Infelizmente não foi possível atualizar seu vídeo de apresentação.');
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
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
  },
}));

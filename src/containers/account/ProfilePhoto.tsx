import { Artist } from '@favid-inc/api';
import { ThemeType, withStyles } from '@kitten/theme';
import { Avatar, AvatarProps, Button } from '@kitten/ui';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import Modal from 'react-native-modal';

import { CameraIconFill, GridIconOutline } from '@src/assets/icons';

import { Canceler, CancelToken, uploadProfilePhoto } from './uploadProfilePhoto';

interface ComponentProps {
  artist: Artist;
  onChange: (string) => void;
}

interface State {
  isUploading: boolean;
  isModalVisible: boolean;
  pickerSource: 'camera' | 'gallery' | null;
}

type Props = ComponentProps & AvatarProps;

class ProfilePhotoComponent extends React.Component<Props, State> {
  public state: State = {
    isUploading: false,
    isModalVisible: false,
    pickerSource: null,
  };

  private uploadCanceler: Canceler;
  private isLive: boolean = true;

  public componentWillUnmount() {
    this.isLive = false;
    if (this.uploadCanceler) {
      this.uploadCanceler();
    }
  }

  public render() {
    const { themedStyle, artist } = this.props;

    return (
      <View style={themedStyle.container}>
        <Avatar source={{ uri: artist.photoUri, height: 100, width: 100 }} style={themedStyle.container} />
        {this.state.isUploading ? (
          <ActivityIndicator style={themedStyle.edit} color='#0000ff' />
        ) : (
            <Button style={themedStyle.edit} activeOpacity={0.95} icon={CameraIconFill} onPress={this.handleModalShow} />
          )}
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

  private handleModalShow = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

    if (status !== 'granted') {
      Alert.alert('Precisamos de permissão para essa ação');
      return;
    }

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
      const imagePickerOptions: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: false,
        aspect: [4, 4],
        quality: 1,
      };

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync(imagePickerOptions)
          : await ImagePicker.launchImageLibraryAsync(imagePickerOptions);

      if (this.isLive) {
        this.setState({ isUploading: true });
      }

      if (result.cancelled === false) {
        const cancelToken: CancelToken = (canceler) => {
          this.uploadCanceler = canceler;
        };

        const { photoUri } = await uploadProfilePhoto(result.uri, cancelToken, () => void 0);

        this.props.onChange(photoUri);
      }
    } catch (e) {
      Alert.alert('Erro', 'Infelizmente não foi possível atualizar sua foto de perfil.');
    } finally {
      if (this.isLive) {
        this.setState({ isUploading: false });
      }
    }
  };
}

export const ProfilePhoto = withStyles<ComponentProps>(ProfilePhotoComponent, (theme: ThemeType) => ({
  container: {
    width: 124,
    height: 124,
    alignSelf: 'center',
  },
  edit: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 48,
    height: 48,
    borderRadius: 24,
    transform: [{ translateY: 82 }],
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

import { Artist } from '@favid-inc/api';
import { ThemeType, withStyles } from '@kitten/theme';
import { Avatar, AvatarProps, Button, Text } from '@kitten/ui';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import { VideoIcon, VideoOffIcon } from '@src/assets/icons';

import { Canceler, CancelToken, uploadProfilePhoto } from './uploadProfilePhoto';

interface ComponentProps {
  artist: Artist;
}

interface State {
  isUploading: boolean;
  image: string;
}

type Props = ComponentProps & AvatarProps;

class PresentationVideoComponent extends React.Component<Props, State> {
  public state: State = {
    isUploading: false,
    image: null,
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
    const { themedStyle, artist, ...restProps } = this.props;

    return (
      <View style={themedStyle.container}>

        {this.state.isUploading ? (
          <ActivityIndicator style={themedStyle.edit} color='#0000ff' />
        ) : (
          <View>
            <Button activeOpacity={0.95} icon={VideoIcon} onPress={this.hadleVideoPicker} />
            <Text appearance='hint'>Video de Apresentação.</Text>
          </View>
        )}
      </View>
    );
  }

  public hadleVideoPicker = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

      this.handleVideoPicked(pickerResult);
    }
  };

  public handleVideoPicked = async (pickerResult) => {
    let uploadResponse = null;
    let uploadResult = null;

    try {
      this.setState({ isUploading: true });

      if (!pickerResult.cancelled) {
        uploadResponse = await this.uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();

        this.setState({
          image: uploadResult.location,
        });
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      Alert.alert('Upload failed, sorry :(');
    } finally {
      this.setState({
        isUploading: false,
      });
    }
  };

  public uploadImageAsync = async (uri) => {
    const apiUrl = 'https://file-upload-example-backend-dkhqoilqqn.now.sh/upload';

    // Note:
    // Uncomment this if you want to experiment with local server
    //
    // if (Constants.isDevice) {
    //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
    // } else {
    //   apiUrl = `http://localhost:3000/upload`
    // }

    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    const formData = new FormData();
    formData.append('photo', {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    // return fetch(apiUrl, options);
  };
}

export const PresentationVideo = withStyles<ComponentProps>(PresentationVideoComponent, (theme: ThemeType) => ({
  container: {
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
}));

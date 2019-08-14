import { Artist } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button } from '@kitten/ui';
import React from 'react';
import { Alert, ButtonProps, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { CameraIconFill } from '@src/assets/icons';
import { ContainerView, textStyle } from '@src/components/common';

import { ArtistForm } from './ArtistForm';
import { ProfileSetting } from './ProfileInfo';
import { ProfilePhoto } from './ProfilePhoto';

import { loadProfile } from './loadProfile';
import { updateProfile } from './updateProfile';

// tslint:disable-next-line: no-empty-interface
interface ComponentProps {}

export type Props = ThemedComponentProps & ComponentProps;

interface State {
  artist: Artist;
  loading: boolean;
}

class AccountComponent extends React.Component<Props, State> {
  public state: State = {
    artist: null,
    loading: null,
  };

  private isLive: boolean = true;

  public componentWillUnmount() {
    this.isLive = false;
  }

  public async componentWillMount() {
    try {
      const artist = await loadProfile();
      if (this.isLive) {
        this.setState({ artist });
      }
    } catch (e) {
      Alert.alert('Erro', 'Infelizmente os dados do seu perfil não puderam ser carregados.');
    } finally {
      if (this.isLive) {
        this.setState({ loading: false });
      }
    }
  }

  public render() {
    const { themedStyle } = this.props;
    const { artist, loading } = this.state;

    if (!artist) {
      return <View />;
    }

    return (
      <KeyboardAwareScrollView>
        <ContainerView style={themedStyle.container}>
          <View style={themedStyle.photoSection}>
            <ProfilePhoto
              style={themedStyle.photo}
              source={{ uri: artist.photo, height: 100, width: 100 }}
              button={this.renderPhotoButton}
            />
          </View>

          <View style={themedStyle.infoSection}>
            <ProfileSetting hint='Email' value={artist.email} />
            <ProfileSetting hint='Nome' value={artist.name} />
          </View>

          <View style={themedStyle.infoSection}>
            <ArtistForm artist={artist} />
          </View>

          <Button
            style={themedStyle.button}
            textStyle={textStyle.button}
            size='large'
            status='info'
            onPress={this.handleSaveClick}
            disabled={loading}
          >
            {loading ? 'Enviando dados...' : 'Salvar'}
          </Button>
        </ContainerView>
      </KeyboardAwareScrollView>
    );
  }

  private handleSaveClick = async () => {
    try {
      const artist = await updateProfile(this.state.artist);
      if (this.isLive) {
        this.setState({ artist });
      }
    } catch (e) {
      Alert.alert('Erro', 'Infelizmente os dados do seu perfil não puderam ser salvos.');
    } finally {
      if (this.isLive) {
        this.setState({ loading: false });
      }
    }
  };

  private onPhotoButtonPress = () => {
    // this.props.onUploadPhotoButtonPress();
  };

  private renderPhotoButton = (): React.ReactElement<ButtonProps> => {
    const { themedStyle } = this.props;

    return (
      <Button
        style={themedStyle.photoButton}
        activeOpacity={0.95}
        icon={CameraIconFill}
        onPress={this.onPhotoButtonPress}
      />
    );
  };
}

export const Account = withStyles<ComponentProps>(AccountComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
  photoSection: {
    marginVertical: 20,
  },
  infoSection: {
    marginTop: 24,
    backgroundColor: theme['background-basic-color-1'],
  },
  photo: {
    width: 124,
    height: 124,
    alignSelf: 'center',
  },
  photoButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    transform: [{ translateY: 82 }],
    borderColor: theme['border-basic-color-4'],
    backgroundColor: theme['background-basic-color-4'],
  },
  button: {
    marginHorizontal: 24,
    marginVertical: 24,
  },
}));

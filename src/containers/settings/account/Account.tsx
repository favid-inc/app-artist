import { Artist, ArtistCategory } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button } from '@kitten/ui';
import React from 'react';
import { ActivityIndicator, Alert, ButtonProps, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { CameraIconFill } from '@src/assets/icons';
import { ContainerView, textStyle } from '@src/components/common';

import { ArtistForm } from './ArtistForm';
import { ProfileInfo } from './ProfileInfo';
import { ProfilePhoto } from './ProfilePhoto';

import { listAvailableArtistCategories } from './listAvailableArtistCategories';
import { loadProfile } from './loadProfile';
import { updateProfile } from './updateProfile';

export type Props = ThemedComponentProps;

interface State {
  artist: Artist;
  categories: ArtistCategory[];
  loading: boolean;
}

class AccountComponent extends React.Component<Props, State> {
  public state: State = {
    artist: null,
    categories: [],
    loading: null,
  };

  private isLive: boolean = true;

  public componentWillUnmount() {
    this.isLive = false;
  }

  public async componentDidMount() {
    try {
      this.setState({ loading: true });
      const [artist, categories] = await Promise.all([loadProfile(), listAvailableArtistCategories()]);
      if (this.isLive) {
        this.setState({ artist, categories });
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

    if (loading) {
      return <ActivityIndicator style={themedStyle.container} size='large' />;
    }
    if (!artist) {
      return <View />;
    }

    return (
      <KeyboardAwareScrollView>
        <ContainerView style={themedStyle.container}>
          <View style={themedStyle.photoSection}>
            <ProfilePhoto
              style={themedStyle.photo}
              source={{ uri: artist.photoUri, height: 100, width: 100 }}
              button={this.renderPhotoButton}
            />
          </View>

          <View style={themedStyle.infoSection}>
            <ProfileInfo hint='Email' value={artist.email} />
            <ProfileInfo hint='Nome' value={artist.name} />
            <ArtistForm artist={artist} categories={this.state.categories} />
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

export const Account = withStyles(AccountComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
  photoSection: {
    marginVertical: 20,
  },
  infoSection: {
    marginVertical: 20,
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

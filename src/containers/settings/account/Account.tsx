import { Artist, ArtistCategory } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button } from '@kitten/ui';
import React from 'react';
import { ActivityIndicator, Alert, ButtonProps, RefreshControl, ScrollView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ContainerView, textStyle } from '@src/components/common';

import { ArtistForm } from './ArtistForm';
import { ProfileInfo } from './ProfileInfo';
import { ProfilePhoto } from './ProfilePhoto';

import { listAvailableArtistCategories } from './listAvailableArtistCategories';
import { loadProfile } from './loadProfile';
import { updateProfile } from './updateProfile';
import { PresentationVideo } from './PresentationVideo';

export type Props = ThemedComponentProps;

interface State {
  artist: Artist;
  categories: ArtistCategory[];
  loading: boolean;
  saving: boolean;
}

class AccountComponent extends React.Component<Props, State> {
  public state: State = {
    artist: null,
    categories: [],
    loading: false,
    saving: false,
  };

  private isLive: boolean = true;

  public componentWillUnmount() {
    this.isLive = false;
  }

  public async componentDidMount() {
    this.handleRefresh();
  }

  public render() {
    const { themedStyle } = this.props;
    const { artist, loading, saving } = this.state;

    if (loading) {
      return <ActivityIndicator style={themedStyle.container} size='large' />;
    }
    if (!artist) {
      return <View />;
    }

    return (
      <ScrollView
        contentContainerStyle={themedStyle.contentContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={this.handleRefresh} />}
      >
        <KeyboardAwareScrollView>
          <ContainerView style={themedStyle.container}>
            <View style={themedStyle.photoSection}>
              <ProfilePhoto artist={artist} onChange={this.handlePhotoUriChange} />
            </View>
            <View style={themedStyle.infoSection}>
              <ProfileInfo hint='Email' value={artist.email} />
              <ProfileInfo hint='Nome' value={artist.name} />
              <PresentationVideo artist={artist} onChange={this.handleVideoUriChange} />
              <ArtistForm
                artist={artist}
                categories={this.state.categories}
                onArtisticNameChange={this.handleArtisticNameChange}
                onPriceChange={this.handlePriceChange}
                onBiographyChange={this.handleBiographyChange}
                onMainCategoryChange={this.handleMainCategoryChange}
                onCategoriesChange={this.handleCategoriesChange}
              />
            </View>
            <Button
              style={themedStyle.button}
              textStyle={textStyle.button}
              size='large'
              status='info'
              onPress={this.handleSaveClick}
              disabled={saving}
            >
              {saving ? 'Enviando dados...' : 'Salvar'}
            </Button>
          </ContainerView>
        </KeyboardAwareScrollView>
      </ScrollView>
    );
  }

  private handlePhotoUriChange = (photoUri = '') => {
    this.setState({ artist: { ...this.state.artist, photoUri } });
  };

  private handleVideoUriChange = (videoUri = '') => {
    this.setState({ artist: { ...this.state.artist, videoUri } });
  };

  private handleArtisticNameChange = (artisticName = '') => {
    this.setState({ artist: { ...this.state.artist, artisticName } });
  };

  private handlePriceChange = (price = '') => {
    this.setState({ artist: { ...this.state.artist, price: parseInt(price.replace(/\D/g, ''), 10) || 0 } });
  };

  private handleBiographyChange = (biography = '') => {
    this.setState({ artist: { ...this.state.artist, biography } });
  };

  private handleMainCategoryChange = (mainCategory = '') => {
    this.setState({ artist: { ...this.state.artist, mainCategory } });
  };

  private handleCategoriesChange = (categories = []) => {
    this.setState({ artist: { ...this.state.artist, categories } });
  };

  private handleSaveClick = async () => {
    try {
      this.setState({ saving: true });
      const artist = await updateProfile(this.state.artist);
      if (this.isLive) {
        this.setState({ artist });
      }
    } catch (e) {
      Alert.alert('Erro', 'Infelizmente os dados do seu perfil não puderam ser salvos.');
    } finally {
      if (this.isLive) {
        this.setState({ saving: false });
      }
    }
  };

  private handleRefresh = async () => {
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
  button: {
    marginHorizontal: 24,
    marginVertical: 24,
  },
}));

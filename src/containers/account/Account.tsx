import { Artist, ArtistCategory, ArtistRegisterStatus } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button } from '@kitten/ui';
import React from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import validate from 'validate.js';
import moment from 'moment';

import { ContainerView, textStyle } from '@src/components/common';

import { ArtistForm } from './ArtistForm';
import { ProfileInfo } from './ProfileInfo';
import { ProfilePhoto } from './ProfilePhoto';

import { listAvailableArtistCategories } from './listAvailableArtistCategories';
import { loadProfile } from './loadProfile';
import { PresentationVideo } from './PresentationVideo';
import { updateProfile } from './updateProfile';

export type Props = ThemedComponentProps;

interface State {
  artist: Artist;
  categories: ArtistCategory[];
  loading: boolean;
  saving: boolean;
}

const constraints = {
  name: {
    length: {
      minimum: 6,
      message: '^Preencha seu nome',
    },
  },
  birthdate: {
    presence: {
      message: '^Selecione uma data de nascimento',
    },
    numericality: {
      lessThanOrEqualTo: +moment().subtract(13, 'years'),
      message: '^Voce deve ter no mínimo 13 anos de idade',
    },
  },
};

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
              <PresentationVideo artist={artist} onChange={this.handleVideoUriChange} />
              <ArtistForm
                artist={artist}
                categories={this.state.categories}
                onNameChange={this.handleNameChange}
                onArtisticNameChange={this.handleArtisticNameChange}
                onPriceChange={this.handlePriceChange}
                onBiographyChange={this.handleBiographyChange}
                onMainCategoryChange={this.handleMainCategoryChange}
                onCategoriesChange={this.handleCategoriesChange}
                onBirthdateChange={this.handleBirthdateChange}
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
              {saving
                ? 'Enviando dados...'
                : artist.registerStatus === ArtistRegisterStatus.INCOMPLETED
                ? 'Enviar dados para análise'
                : 'Atualizar Perfil'}
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

  private handleNameChange = (name = '') => {
    this.setState({ artist: { ...this.state.artist, name } });
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

  private handleBirthdateChange = (birthdateFormatted, birthdate) => {
    this.setState({ artist: { ...this.state.artist, birthdate: birthdate.getTime() } });
  };

  private handleSaveClick = async () => {
    const errors = validate(this.state.artist, constraints);

    if (errors) {
      Alert.alert('Verifique os erros abaixo listados antes de prosseguir', Object.values(errors).join('\n'));
      return;
    }

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
        Alert.alert(
          'Criação de conta',
          'Preencha os campos abaixo para solicitar uma conta de Artista.' +
            ' Os dados enviados passarão por análise e aprovação antes de você poder acessar a plataforma.',
        );
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

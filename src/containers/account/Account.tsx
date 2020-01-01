import { Artist, ArtistCategory, ArtistRegisterStatus } from '@favid-inc/api';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button } from '@kitten/ui';
import React from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import validate from 'validate.js';
import moment from 'moment';
import * as firebase from 'firebase';

import { textStyle } from '@src/components/common';
import { AuthContext } from '@src/core/auth';

import { ArtistForm } from './ArtistForm';
import { ProfileInfo } from './ProfileInfo';
import { ProfilePhoto } from './ProfilePhoto';

import { listAvailableArtistCategories } from './listAvailableArtistCategories';
import { loadProfile } from './loadProfile';
import { PresentationVideo } from './PresentationVideo';
import { updateProfile } from './updateProfile';
import { CallToActionCard } from './CallToActionCard';

export type Props = ThemedComponentProps;

interface State {
  artist: Artist;
  categories: ArtistCategory[];
  loading: boolean;
  saving: boolean;
}

const constraints: Partial<Record<keyof Artist, any>> = {
  artisticName: {
    presence: {
      allowEmpty: false,
      message: '^Preencha seu nome artistico',
    },
  },
  name: {
    length: {
      minimum: 6,
      message: '^Preencha seu nome',
    },
  },
  biography: {
    length: {
      minimum: 6,
      message: '^Biografia muito curta',
    },
  },
  mainCategory: {
    presence: {
      allowEmpty: false,
      message: '^Selecione sua categoria principal',
    },
  },
  photoUri: {
    presence: {
      allowEmpty: false,
      message: '^Adicione uma foto',
    },
  },
  videoUri: {
    presence: {
      allowEmpty: false,
      message: '^Adicione um vídeo de apresentação',
    },
  },
  birthdate: {
    presence: {
      message: '^Selecione uma data de nascimento',
    },
    numericality: {
      lessThanOrEqualTo: +moment().subtract(13, 'years'),
      message: '^Você deve ter no mínimo 13 anos de idade',
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
      return (
        <View style={themedStyle.container}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    if (!artist) {
      return (
        <ScrollView
          contentContainerStyle={themedStyle.container}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={this.handleRefresh} />}
        >
          <CallToActionCard
            description='Desculpe. Os dados da sua conta não puderam ser carregados.'
            action='Carregar novamente'
            onCallAction={this.handleRefresh}
          />

          <SignOutButton themedStyle={themedStyle} />
        </ScrollView>
      );
    }

    if (artist.registerStatus === ArtistRegisterStatus.PENDING) {
      return (
        <ScrollView
          contentContainerStyle={themedStyle.container}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={this.handleRefresh} />}
        >
          <RegisterPendingCard />
        </ScrollView>
      );
    }

    if (artist.registerStatus === ArtistRegisterStatus.DENIED) {
      return (
        <ScrollView
          contentContainerStyle={themedStyle.container}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={this.handleRefresh} />}
        >
          <RegisterDeniedCard />
        </ScrollView>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={themedStyle.container}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={this.handleRefresh} />}
      >
        <KeyboardAwareScrollView>
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
            <Button
              style={themedStyle.button}
              textStyle={textStyle.button}
              size='giant'
              status='info'
              onPress={this.handleSaveClick}
              disabled={saving}
            >
              {saving
                ? 'Enviando dados...'
                : artist.registerStatus === ArtistRegisterStatus.INCOMPLETE
                  ? 'Enviar dados para análise'
                  : 'Atualizar Perfil'}
            </Button>
            <SignOutButton themedStyle={themedStyle} />
          </View>
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

      Alert.alert('Sucesso', 'Dados atualizados');
    } catch (e) {
      Alert.alert('Erro', e?.response?.data ?? 'Infelizmente os dados do seu perfil não puderam ser salvos.');
    } finally {
      if (this.isLive) {
        this.setState({ saving: false });
      }
    }
  };

  private handleRefresh = async () => {
    try {
      this.setState({ loading: true, artist: null, categories: null });
      const [artist, categories] = await Promise.all([
        loadProfile(),
        listAvailableArtistCategories(),
        firebase.auth().currentUser.getIdToken(true),
      ]);
      if (!this.isLive) {
        return;
      }
      if (artist.registerStatus === ArtistRegisterStatus.INCOMPLETE) {
        Alert.alert(
          'Criação de conta',
          'Preencha os campos abaixo para solicitar uma conta de Artista.' +
          ' Os dados enviados passarão por análise e aprovação antes de você poder acessar a plataforma.',
        );
      }

      this.setState({ artist, categories });
    } finally {
      if (this.isLive) {
        this.setState({ loading: false });
      }
    }
  };
}

const RegisterPendingCard = () => {
  const context = React.useContext(AuthContext);
  const handleCallAction = React.useCallback(() => context.signOut(), [context]);

  return (
    <CallToActionCard
      description={[
        'Parabéns',
        'registramos seu cadastro na favid',
        'assim que o administrador autorizar seu acesso',
        'você receberá um email de validação.',
      ].join(', ')}
      action='Sair'
      onCallAction={handleCallAction}
    />
  );
};

const RegisterDeniedCard = () => {
  const context = React.useContext(AuthContext);
  const handleCallAction = React.useCallback(() => context.signOut(), [context]);

  return (
    <CallToActionCard
      description='Infelizmente sua inscrição como artista não foi aprovada.'
      action='Sair'
      onCallAction={handleCallAction}
    />
  );
};

const SignOutButton = ({ themedStyle }) => {
  const context = React.useContext(AuthContext);
  const handleCallAction = React.useCallback(() => context.signOut(), [context]);

  return (
    <Button
      status='danger'
      style={themedStyle.button}
      textStyle={textStyle.button}
      size='giant'
      onPress={handleCallAction}
    >
      Sair
    </Button>
  );
};

export const Account = withStyles(AccountComponent, (theme: ThemeType) => ({
  container: {
    alignItems: 'center',
    backgroundColor: theme['background-basic-color-2'],
    flexDirection: 'column',
    justifyContent: 'center',
  },
  photoSection: {
    marginVertical: 20,
  },
  infoSection: {
    marginVertical: 20,
    backgroundColor: theme['background-basic-color-1'],
  },
  button: {
    marginHorizontal: 20,
    marginVertical: 24,
  },
}));

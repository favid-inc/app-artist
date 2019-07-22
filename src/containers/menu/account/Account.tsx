import React from 'react';
import { ButtonProps, View } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, Text } from '@kitten/ui';
import { ProfileSetting } from './profileSetting.component';
import { ProfilePhoto } from './profilePhoto.component';
import { CameraIconFill } from '@src/assets/icons';
import { ContainerView, textStyle, ValidationInput } from '@src/components/common';
import { ArtistModel } from '@favid-inc/api';
import { NameValidator, StringValidator } from '@src/core/validators';
import { LoadingAnimationComponent } from '@src/assets/icons';

interface ComponentProps {
  loading: boolean;
  artist: ArtistModel;
  onUploadPhotoButtonPress: () => void;
  onSave: (artist: ArtistModel, artistId: string) => void;
  onSignOut: () => void;
}

export type AccountProps = ThemedComponentProps & ComponentProps;

export interface State {
  artist: ArtistModel;
}

class Accountomponent extends React.Component<AccountProps, State> {
  public state: State = {
    artist: {
      name: '',
      artisticName: '',
      price: 0,
      about: '',
      mainCategory: '',
      location: '',
      responseTime: 0,
    },
  };

  private onSave = () => {
    this.props.onSave(this.state.artist, this.state.artist.id);
  };

  private onSignOut = () => {
    this.props.onSignOut();
  };

  private onPhotoButtonPress = () => {
    this.props.onUploadPhotoButtonPress();
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

  public componentWillMount() {
    this.setState({ artist: { ...this.props.artist } });
  }

  public render(): React.ReactNode {
    const { themedStyle, artist } = this.props;
    const imageSource = {
      uri: artist.photo,
      height: 100,
      width: 100,
    };
    return (
      <ContainerView style={themedStyle.container}>
        <View style={themedStyle.photoSection}>
          <ProfilePhoto style={themedStyle.photo} source={imageSource} button={this.renderPhotoButton} />
        </View>
        <View style={themedStyle.infoSection}>
          <ProfileSetting style={themedStyle.profileSetting} hint='Id' value={artist.id} />
          <ProfileSetting style={themedStyle.profileSetting} hint='Email' value={artist.email} />
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              value={this.state.artist.artisticName}
              style={themedStyle.input}
              textStyle={textStyle.paragraph}
              labelStyle={textStyle.label}
              label='Nome Artístico'
              placeholder='José'
              validator={NameValidator}
              onChangeText={artisticName => this.setState({ artist: { ...this.state.artist, artisticName } })}
            />
          </View>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              value={this.state.artist.price.toString()}
              style={themedStyle.input}
              textStyle={textStyle.paragraph}
              labelStyle={textStyle.label}
              label='Preço'
              placeholder='50.00'
              validator={StringValidator}
              onChangeText={price => this.setState({ artist: { ...this.state.artist, price: parseFloat(price) } })}
            />
          </View>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              value={this.state.artist.mainCategory}
              style={themedStyle.input}
              textStyle={textStyle.paragraph}
              labelStyle={textStyle.label}
              label='Categoria Principal'
              placeholder='Artista'
              validator={NameValidator}
              onChangeText={mainCategory => this.setState({ artist: { ...this.state.artist, mainCategory } })}
            />
          </View>
          {this.props.loading ? (
            <Text appearance='hint' style={themedStyle.text}>
              Enviar dados...
            </Text>
          ) : null}

          <Button
            style={themedStyle.button}
            textStyle={textStyle.button}
            size='large'
            status='info'
            onPress={this.onSave}
            disabled={this.props.loading}
          >
            Save
          </Button>
        </View>
        <Button
          style={themedStyle.button}
          textStyle={textStyle.button}
          size='large'
          status='danger'
          onPress={this.onSignOut}
        >
          Logout
        </Button>
      </ContainerView>
    );
  }
}

export const Account = withStyles(Accountomponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
  photoSection: {
    marginVertical: 40,
  },
  infoSection: {
    marginTop: 24,
    backgroundColor: theme['background-basic-color-1'],
  },
  contactSection: {
    marginTop: 24,
    backgroundColor: theme['background-basic-color-1'],
  },
  profileSetting: {
    borderBottomWidth: 1,
    borderBottomColor: theme['border-basic-color-2'],
  },
  middleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    flexWrap: 'wrap',
    flex: 1,
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
  text: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'opensans-regular',
  },
}));

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
import { TextInput } from 'react-native-gesture-handler';

interface ComponentProps {
  loading: boolean;
  artist: ArtistModel;
  onUploadPhotoButtonPress: () => void;
  onSave: (artist: ArtistModel, artistId: string) => void;
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
          <ProfileSetting style={themedStyle.profileSetting} hint='Email' value={artist.email} />
          <ProfileSetting style={themedStyle.profileSetting} hint='Nome' value={artist.name} />
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              value={this.state.artist.artisticName}
              style={themedStyle.input}
              textStyle={[textStyle.paragraph, themedStyle.inputText]}
              labelStyle={textStyle.label}
              placeholder='Nome Artístico'
              validator={NameValidator}
              onChangeText={artisticName => this.setState({ artist: { ...this.state.artist, artisticName } })}
            />
          </View>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              value={`${this.state.artist.price}`}
              style={themedStyle.input}
              textStyle={[textStyle.paragraph, themedStyle.inputText]}
              labelStyle={textStyle.label}
              placeholder='Preço'
              validator={StringValidator}
              onChangeText={price => this.setState({ artist: { ...this.state.artist, price: parseFloat(price) } })}
            />
          </View>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <ValidationInput
              value={this.state.artist.mainCategory}
              style={themedStyle.input}
              textStyle={[textStyle.paragraph, themedStyle.inputText]}
              labelStyle={textStyle.label}
              placeholder='Grupo'
              validator={NameValidator}
              onChangeText={mainCategory => this.setState({ artist: { ...this.state.artist, mainCategory } })}
            />
          </View>
          <View style={[themedStyle.middleContainer, themedStyle.profileSetting]}>
            <TextInput
              style={themedStyle.inputMultiLine}
              multiline={true}
              numberOfLines={4}
              placeholderTextColor='#8893ab'
              placeholder='Biografia'
              maxLength={240}
              onChangeText={about => this.setState({ artist: { ...this.state.artist, about } })}
              value={this.state.artist.about}
            />
          </View>
          <Text appearance='hint' style={themedStyle.text}>
            {`${240 - this.state.artist.about.length} Caracteres restantes`}
          </Text>
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
    marginVertical: 20,
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
  inputText: {
    color: theme['text-alternative-color'],
  },
  input: {
    flexWrap: 'wrap',
    flex: 1,
    backgroundColor: theme['background-alternative-color-1'],
    borderColor: theme['text-alternative-color'],
  },
  inputMultiLine: {
    flexWrap: 'wrap',
    flex: 1,
    backgroundColor: theme['background-alternative-color-1'],
    height: 150,
    borderRadius: 5,
    borderColor: theme['text-alternative-color'],
    borderWidth: 1,
    padding: 10,
    fontSize: 17,
    fontFamily: 'opensans-regular',
    width: '100%',
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

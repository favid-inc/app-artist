import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { favidImage, googleImage } from '@src/assets/images';
import { AuthContext } from '@src/core/auth';
import * as config from '@src/core/config';

// tslint:disable-next-line: no-empty-interface
interface ComponentProps {}

type Props = ThemedComponentProps & NavigationScreenProps & ComponentProps;

interface State {
  loading: boolean;
}

class SignInContainerComponent extends React.Component<Props, State> {
  static contextType = AuthContext;
  public context: React.ContextType<typeof AuthContext>;

  public state: State = {
    loading: false,
  };

  public render() {
    const { themedStyle } = this.props;

    if (this.state.loading) {
      return (
        <View style={themedStyle.container}>
          <Text style={themedStyle.TextStyle}>Autenticando...</Text>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    return (
      <View style={themedStyle.container}>
        <Image source={favidImage.imageSource} style={themedStyle.ImageLogoStyle} />
        <Text style={themedStyle.WelcomeText}>Bem vindo ao</Text>
        <Text style={[themedStyle.WelcomeText, themedStyle.WelcomeTextBold]}>Favid!</Text>
        <View style={themedStyle.contentContainer}>
          <TouchableOpacity style={themedStyle.GooglePlusStyle} onPress={this.handleGoogleAuthClick}>
            <Image source={googleImage.imageSource} style={themedStyle.ImageIconStyle} />
            <Text style={themedStyle.TextStyle}>Continue com Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  private async signIn(provider: 'google') {
    try {
      this.setState({ loading: true });
      this.context.signIn(config.auth[provider]);
    } catch (e) {
      Alert.alert('Desculpe', 'Infelizmente a não pude verificar seus dados.');
    } finally {
      this.setState({ loading: false });
    }
  }

  private handleGoogleAuthClick = async () => {
    await this.signIn('google');
  };
}

export const SignInContainer = withStyles<ComponentProps>(SignInContainerComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
    alignItems: 'center',
    paddingVertical: 100,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 130,
  },
  GooglePlusStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme['background-basic-color-2'],
    height: 50,
    width: 250,
    borderRadius: 4,
    borderColor: theme['color-basic-400'],
    borderWidth: 1.5,
    padding: 10,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  ImageLogoStyle: {
    padding: 10,
    margin: 5,
    height: 150,
    width: 150,
    resizeMode: 'stretch',
  },
  TextStyle: {
    color: theme['color-basic-400'],
    fontFamily: 'opensans-bold',
    fontSize: 18,
    marginBottom: 4,
    marginRight: 20,
  },
  WelcomeTextBold: {
    fontFamily: 'opensans-bold',
  },
  WelcomeText: {
    color: theme['color-basic-400'],
    fontSize: 30,
    marginBottom: 4,
    marginRight: 20,
    fontFamily: 'opensans-regular',
    textAlign: 'center',
    width: 300,
  },
}));

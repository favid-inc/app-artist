import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { favidImage, googleImage } from '@src/assets/images';
import { ScrollableAvoidKeyboard } from '@src/components/common';
import { AuthContext } from '@src/core/auth';
// import * as config from '@src/core/config';
import { AuthForm } from './AuthForm';
import { SocialAuth } from './SocialAuth';

type Props = ThemedComponentProps & NavigationScreenProps;

class SignInContainerComponent extends React.Component<Props> {
  static contextType = AuthContext;
  public context: React.ContextType<typeof AuthContext>;

  public render() {
    const { themedStyle } = this.props;

    if (this.context.isSigningIn) {
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
        <ScrollableAvoidKeyboard>
          <View style={themedStyle.contentContainer}>
            <AuthForm onSignIn={this.handleSignIn} onSignUp={this.handleSignUp} />
            <SocialAuth onGooglePress={console.log} onFacebookPress={console.log} />
          </View>
        </ScrollableAvoidKeyboard>
      </View>
    );
  }

  private handleSignIn = (formData) => {
    console.log(formData);
  };

  private handleSignUp = (formData) => {
    console.log(formData);
  };

  private async signIn(provider: 'google') {
    try {
      // this.context.signIn(config.auth[provider]);
    } catch (e) {
      Alert.alert('Desculpe', 'Infelizmente suas credenciais não puderam ser validadas.');
    }
  }

  private handleGoogleAuthClick = async () => {
    // await this.signIn('google');
  };
}

export const SignInContainer = withStyles(SignInContainerComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
    alignItems: 'center',
    paddingVertical: 20,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
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
    height: 20,
    width: 20,
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
    fontSize: 16,
    marginBottom: 4,
    marginRight: 20,
    fontFamily: 'opensans-regular',
    textAlign: 'center',
    width: 300,
  },
}));

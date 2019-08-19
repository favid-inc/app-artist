import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { CheckBox } from '@kitten/ui';
import React from 'react';
import { ActivityIndicator, Alert, Image, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { favidImage } from '@src/assets/images';
import { ScrollableAvoidKeyboard, textStyle } from '@src/components/common';
import { AuthContext } from '@src/core/auth';
import * as config from '@src/core/config';

import { AuthForm } from './AuthForm';
import { SocialAuth } from './SocialAuth';
import { AuthFormData } from './type';

type Props = ThemedComponentProps & NavigationScreenProps;

interface State {
  termsAccepted: boolean;
}

class AuthContainerComponent extends React.Component<Props, State> {
  static contextType = AuthContext;
  public context: React.ContextType<typeof AuthContext>;

  public state: State = {
    termsAccepted: true,
  };

  public render() {
    const { themedStyle } = this.props;

    if (this.context.isSigningIn) {
      return (
        <View style={themedStyle.container}>
          <Image source={favidImage.imageSource} style={themedStyle.logoStyle} />
          <View style={themedStyle.contentContainer}>
            <View style={themedStyle.container}>
              <ActivityIndicator size='large' />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={themedStyle.container}>
        <Image source={favidImage.imageSource} style={themedStyle.logoStyle} />
        <ScrollableAvoidKeyboard>
          <View style={themedStyle.contentContainer}>
            <AuthForm onSignIn={this.handleSignIn} onSignUp={this.handleSignUp} />
            <SocialAuth onGoogleSignIn={this.handleGoogleSignIn} onFacebookSignIn={this.handleFacebookSignIn} />
            <CheckBox
              style={themedStyle.termsCheckBox}
              textStyle={themedStyle.termsCheckBoxText}
              checked={this.state.termsAccepted}
              text={'Declaro que li e concordo com os termos de uso'}
              onChange={this.handleTermsAcceptChange}
            />
          </View>
        </ScrollableAvoidKeyboard>
      </View>
    );
  }

  private handleSignIn = (formData: AuthFormData) => {
    if (!this.state.termsAccepted) {
      Alert.alert('Termos de uso', 'Você deve aceitar os termos de uso para realizar essa ação');
      return;
    }
    this.context.signInWithEmailAndPassword(formData.email, formData.password);
  };

  private handleSignUp = (formData: AuthFormData) => {
    if (!this.state.termsAccepted) {
      Alert.alert('Termos de uso', 'Você deve aceitar os termos de uso para realizar essa ação');
      return;
    }
    this.context.signUp(formData.email, formData.password);
  };

  private handleTermsAcceptChange = (termsAccepted: boolean) => {
    this.setState({ termsAccepted });
  };

  private handleGoogleSignIn = () => {
    if (!this.state.termsAccepted) {
      Alert.alert('Termos de uso', 'Você deve aceitar os termos de uso para realizar essa ação');
      return;
    }
    this.context.signInWithOAuth(config.auth.google);
  };

  private handleFacebookSignIn = () => {
    if (!this.state.termsAccepted) {
      Alert.alert('Termos de uso', 'Você deve aceitar os termos de uso para realizar essa ação');
      return;
    }
    // await this.signIn('google');
  };
}

export const AuthContainer = withStyles(AuthContainerComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
    alignItems: 'center',
    paddingVertical: 10,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  logoStyle: {
    padding: 10,
    // margin: 5,
    height: 50,
    width: 50,
    resizeMode: 'stretch',
  },
  textStyle: {
    color: theme['color-basic-400'],
    fontFamily: 'opensans-bold',
    fontSize: 18,
    marginBottom: 4,
    marginRight: 20,
  },

  termsCheckBox: {
    margin: 20,
  },
  termsCheckBoxText: {
    fontSize: 11,
    color: theme['text-hint-color'],
    ...textStyle.paragraph,
  },
}));

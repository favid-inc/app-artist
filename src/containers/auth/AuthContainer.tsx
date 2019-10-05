import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { ActivityIndicator, Alert, Image, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import { favidImage } from '@src/assets/images';
import { ScrollableAvoidKeyboard } from '@src/components/common';
import { AuthContext } from '@src/core/auth';

import { AuthForm } from './AuthForm';
import { SocialAuth } from './SocialAuth';
import { TermsAndPolicies } from './TermsAndPolicies';
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
          <Image source={favidImage.imageSource} style={themedStyle.logo} />
          <View style={themedStyle.container}>
            <ActivityIndicator size='large' />
          </View>
        </View>
      );
    }

    return (
      <View style={themedStyle.container}>
        <Image source={favidImage.imageSource} style={themedStyle.logo} />
        <ScrollableAvoidKeyboard>
          <AuthForm onSignIn={this.handleSignIn} onSignUp={this.handleSignUp} />
          <SocialAuth onGoogleSignIn={this.handleGoogleSignIn} onFacebookSignIn={this.handleFacebookSignIn} />
          <TermsAndPolicies
            onTermsAcceptedChange={this.handleTermsAcceptChange}
            termsAcceptedValue={this.state.termsAccepted}
          />
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
    this.context.signInWithGoogle();
  };

  private handleFacebookSignIn = () => {
    if (!this.state.termsAccepted) {
      Alert.alert('Termos de uso', 'Você deve aceitar os termos de uso para realizar essa ação');
      return;
    }
    this.context.signInWithFacebook();
  };
}

export const AuthContainer = withStyles(AuthContainerComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
    alignItems: 'stretch',
    padding: 10,
  },
  logo: {
    padding: 10,
    height: 50,
    width: 50,
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
}));
